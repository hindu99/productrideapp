// src/test/requirementpage.test.jsx
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import RequirementsPage from "../pages/Requirementpage/requirementpage";

// Mocking the layout
jest.mock("../components/PageLayouts/pagelayout", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="layout">{children}</div>,
}));

// Mocking ProjectSelect
jest.mock("../components/SelectionDropdowns/projectselector.jsx", () => ({
  __esModule: true,
  default: ({ value, onChange }) => (
    <select
      aria-label="Project"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select a project</option>
      <option value="p1">Project A</option>
    </select>
  ),
}));

//react-router-dom mock
jest.mock("react-router-dom", () => ({
  __esModule: true,
  useNavigate: () => jest.fn(),
  useParams: () => ({}),
  useLocation: () => ({
    state: {
      requirement: "Prefilled requirement from state",
      acceptanceCriteria: "Prefilled AC from state",
    },
  }),
}));

// Mock token helper
jest.mock("../HelperFunctions/addtoken", () => ({
  addToken: () => ({ Authorization: "Bearer test-token" }),
}));

// Fake users returned by the users fetch
const fakeUsers = [
  { user_id: "u1", fullname: "Hindu Karu" },
  { user_id: "u2", fullname: "Hin Lahi" },
];

// this part is finding  the control that sits in the same .input-group as a label
const controlInGroupByLabel = (labelRegex) => {
  const labelEl = screen.getByText(labelRegex, { selector: "label" });
  const group = labelEl.closest(".input-group");
  if (!group) throw new Error("Label not inside .input-group");
  return within(group);
};

describe("RequirementsPage (basic render only)", () => {
  beforeEach(() => {
    jest.spyOn(global, "fetch").mockImplementation((url) => {
      if (String(url).includes("/api/findusers")) {
        return Promise.resolve({
          ok: true,
          json: async () => fakeUsers,
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the main UI components", async () => {
    render(<RequirementsPage />);

    // Layout wrapper present
    expect(screen.getByTestId("layout")).toBeInTheDocument();


    await screen.findByRole("option", { name: /hindu karu/i });

    // Left panel check

    // Sprint 
    expect(controlInGroupByLabel(/sprint/i).getByRole("textbox")).toBeInTheDocument();

    // Assignee (select); includes 'Unassigned' and fetched users
    const assigneeSelect = controlInGroupByLabel(/assignee/i).getByRole("combobox");
    expect(assigneeSelect).toBeInTheDocument();
    expect(within(assigneeSelect).getByRole("option", { name: /unassigned/i })).toBeInTheDocument();
    expect(within(assigneeSelect).getByRole("option", { name: /hindu karu/i })).toBeInTheDocument();
    expect(within(assigneeSelect).getByRole("option", { name: /hin lahi/i })).toBeInTheDocument();

    // Project (mocked ProjectSelect)
    const project = screen.getByLabelText(/project/i);
    expect(project).toBeInTheDocument();
    expect(within(project).getByRole("option", { name: /select a project/i })).toBeInTheDocument();

    // Status and its main options
    const statusSelect = controlInGroupByLabel(/status/i).getByRole("combobox");
    ["In Backlog", "In Development", "In Test", "Completed"].forEach((opt) => {
      expect(within(statusSelect).getByRole("option", { name: opt })).toBeInTheDocument();
    });

    // RICE inputs + Area (number inputs are role 'spinbutton')
    expect(controlInGroupByLabel(/reach/i).getByRole("spinbutton")).toBeInTheDocument();
    expect(controlInGroupByLabel(/impact/i).getByRole("spinbutton")).toBeInTheDocument();
    expect(controlInGroupByLabel(/confidence/i).getByRole("spinbutton")).toBeInTheDocument();
    expect(controlInGroupByLabel(/effort/i).getByRole("spinbutton")).toBeInTheDocument();
    expect(controlInGroupByLabel(/^area$/i).getByRole("textbox")).toBeInTheDocument();

    // Action buttons
    expect(screen.getByRole("button", { name: /approve & save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();

    // Right panel check

    // Title input (has placeholder)
    expect(
      screen.getByPlaceholderText(/add a concise, action-oriented title/i)
    ).toBeInTheDocument();

    // Requirements textarea prefilled from location.state
    const reqTextarea = controlInGroupByLabel(/requirements/i).getByRole("textbox");
    expect(reqTextarea).toHaveValue("Prefilled requirement from state");

    // Acceptance Criteria textarea prefilled from location.state
    const acTextarea = controlInGroupByLabel(/acceptance criteria/i).getByRole("textbox");
    expect(acTextarea).toHaveValue("Prefilled AC from state");

    // No API error initially
    expect(screen.queryByText(/could not load users/i)).not.toBeInTheDocument();

    // Fetch called for users once
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/findusers",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({ Authorization: "Bearer test-token" }),
      })
    );
  });
});
