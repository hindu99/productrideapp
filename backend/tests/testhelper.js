// tests/testhelper.js
import { jest } from '@jest/globals';

export function mockRequest(body = {}, params = {}, query = {}) {
  return { body, params, query };
}

export function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json  = jest.fn().mockReturnValue(res);
  return res;
}
