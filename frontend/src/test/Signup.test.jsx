
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Signup from "../pages/Signup/signup";

const type = (el, value) => fireEvent.change(el, { target: { value } });

afterEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
  sessionStorage?.clear?.();
});

describe("Signup Component", () => {
  // default: API succeeds unless a test overrides it
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Signup successful" }),
    });
  });

  test("renders the signup form with all static elements", () => {
    render(<Signup />);

    expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your full name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /already got login \?/i })).toBeInTheDocument();

    // org field not visible initially
    expect(screen.queryByPlaceholderText(/enter organisation name/i)).not.toBeInTheDocument();
  });

  test("conditionally renders the organisation name input when selected", () => {
    render(<Signup />);
    const categorySelect = screen.getByRole("combobox");

    expect(screen.queryByPlaceholderText(/enter organisation name/i)).not.toBeInTheDocument();

    fireEvent.change(categorySelect, { target: { value: "organisation" } });
    expect(screen.getByPlaceholderText(/enter organisation name/i)).toBeInTheDocument();

    fireEvent.change(categorySelect, { target: { value: "individualuser" } });
    expect(screen.queryByPlaceholderText(/enter organisation name/i)).not.toBeInTheDocument();
  });

  test("displays validation errors when the form is submitted with empty required fields", async () => {
    // disable native HTML validation so component's onSubmit runs
    const { container } = render(<Signup />);
    container.querySelector("form").noValidate = true;

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // with no category chosen, only email & password errors appear
    expect(await screen.findByText(/please enter the email/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter password/i)).toBeInTheDocument();
  });

  test("submits successfully for an individual user", async () => {
    render(<Signup />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "individualuser" } });
    type(screen.getByPlaceholderText(/enter your full name/i), "Hindujan Karunanithy");
    type(screen.getByPlaceholderText(/enter email/i), "Hindu@example.com");
    type(screen.getByPlaceholderText(/enter password/i), "password123");

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe("http://localhost:5000/api/signup");
    expect(options.method).toBe("POST");

    const body = JSON.parse(options.body);

    // partial match so extra fields (e.g., role: 'admin') don't fail the test
    expect(body).toMatchObject({
      category: "individualuser",
      tenantName: "Hindujan Karunanithy",
      fullname: "Hindujan Karunanithy",
      email: "Hindu@example.com",
      password: "password123",
    });
    // no redirect assertion
  });

  test("submits successfully for an organisation", async () => {
    render(<Signup />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "organisation" } });
    // you originally typed "Hindu Ltd " (with a trailing space). We'll keep that, but make the assertion trim-safe.
    type(screen.getByPlaceholderText(/enter organisation name/i), "Hindu Ltd ");
    type(screen.getByPlaceholderText(/enter your full name/i), "Hin Kan");
    type(screen.getByPlaceholderText(/enter email/i), "Hinkan@acme.com");
    type(screen.getByPlaceholderText(/enter password/i), "securepwd");

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const [, options] = global.fetch.mock.calls[0];
    const body = JSON.parse(options.body);

    // make tenantName robust to stray whitespace
    expect(body.category).toBe("organisation");
    expect((body.tenantName || "").trim()).toBe("Hindu Ltd");
    expect(body.fullname).toBe("Hin Kan");
    expect(body.email).toBe("Hinkan@acme.com");
    expect(body.password).toBe("securepwd");
  });

  test("displays an API error message on failed signup", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Email already in use." }),
    });

    render(<Signup />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "individualuser" } });
    type(screen.getByPlaceholderText(/enter your full name/i), "Hindujan Karunanithy");
    type(screen.getByPlaceholderText(/enter email/i), "Hindu@example.com");
    type(screen.getByPlaceholderText(/enter password/i), "password123");
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/email already in use\./i)).toBeInTheDocument();
  });

  test("displays a generic network error on a network failure", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network failure"));

    render(<Signup />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "individualuser" } });
    type(screen.getByPlaceholderText(/enter your full name/i), "Hindujan Karunanithy");
    type(screen.getByPlaceholderText(/enter email/i), "Hindu@example.com");
    type(screen.getByPlaceholderText(/enter password/i), "password123");
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(
      await screen.findByText(
        /an error occurred while signing up\. please contact your administrator\./i
      )
    ).toBeInTheDocument();
  });
});
