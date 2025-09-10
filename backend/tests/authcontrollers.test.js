// tests/authcontrollers.test.js
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mock modules 
await jest.unstable_mockModule('../src/models/authiModel/signupmodel.js', () => ({
  findUserByEmail: jest.fn(),
  createtenant: jest.fn(),
  createUser: jest.fn(),
}));

await jest.unstable_mockModule('bcrypt', () => ({
  default: { hash: jest.fn(), compare: jest.fn() },
}));

await jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { sign: jest.fn() },
}));

// import the mocked modules +
const signupModel = await import('../src/models/authiModel/signupmodel.js');
const { default: bcrypt } = await import('bcrypt');
const { default: jwt } = await import('jsonwebtoken');

import { mockRequest, mockResponse } from './testhelper.js';
const { signup, login } = await import('../src/controllers/authcontrollers/authController.js');

// Tests
describe('Auth Controller (using mock file)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('signup success', async () => {
    const req = mockRequest({
      tenantName: 'Hindu Ltd',
      fullname: 'Hindu Karu',
      category: 'organisation',
      email: 'hindu@test.com',
      password: 'tes123',
      role: 'admin'
    });
    const res = mockResponse();

    signupModel.findUserByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    signupModel.createtenant.mockResolvedValue({});
    signupModel.createUser.mockResolvedValue({});

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
  });

  test('login success', async () => {
    const req = mockRequest({ email: 'hindu@test.com', password: '12563' });
    const res = mockResponse();

    signupModel.findUserByEmail.mockResolvedValue({
      user_id: 'u1',
      tenant_id: 't1',
      email: 'hindu@test.com',
      fullname: 'Hindu Karu',
      role: 'admin',
      password: 'hashedPassword'
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake-jwt');

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: 'fake-jwt' });
  });
});
