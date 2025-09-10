// tests/requirements.controller.test.js
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// --- Mock the model layer (ESM: mock before importing SUT) ---
const createRequirementMock = jest.fn();
const getRequirementByIdMock = jest.fn();
const updateRequirementMock = jest.fn();

await jest.unstable_mockModule('../src/models/requirementmodel/requirementdatahandlingmodel.js', () => ({
  createRequirement: createRequirementMock,
  getRequirementById: getRequirementByIdMock,
  updateRequirement: updateRequirementMock,
}));

// (Optional) keep dotenv quiet in tests
await jest.unstable_mockModule('dotenv', () => ({
  default: { config: () => ({}) },
}));

// --- Import the controller under test ---
const {
  createrequirement,
  getRequirementByIdController,
  updateRequirementController,
} = await import('../src/controllers/Requirementhandlingcontroller/requirementhandlingcontroller.js');

// --- Tiny Express-y helpers ---
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}, params = {}, extra = {}) => ({
  body,
  params,
  tenantId: 4321, // pretend middleware dropped these on req
  userId: 9876,
  ...extra,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createrequirement', () => {
  test('201 on happy path + numeric coercion', async () => {
    const req = mockRequest({
      title: 'Batch pricing ',
      requirements: 'Allow ops to bulk-adjust %',
      acceptanceCriteria: 'Can update 50+ rows; audit log entry created',
      sprint: 'Sprint-19',
      assignee: '007',              // string that should be treated as int-ish
      project: 'pricing-platform',
      status: 'In Backlog',
      reach: '250',                 // strings -> numbers
      impact: '3',
      confidence: '72',
      effort: '8',
      area: 'Revenue Ops',
    });
    const res = mockResponse();

    createRequirementMock.mockResolvedValue(undefined);

    await createrequirement(req, res);

    expect(createRequirementMock).toHaveBeenCalledTimes(1);
    const payload = createRequirementMock.mock.calls[0][0];

    expect(payload).toEqual(
      expect.objectContaining({
        tenantId: 4321,
        userId: 9876,
        title: 'Batch pricing ',
        requirements: 'Allow ops to bulk-adjust  %',
        acceptanceCriteria: 'Can update 50+ rows; audit log entry created',
        sprint: 'Sprint-19',
        assignee: '007',
        project: 'pricing-platform',
        status: 'In Backlog',
        reach: 250,
        impact: 3,
        confidence: 72,
        effort: 8,
        area: 'Revenue Ops',
      })
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Requirement created successfully' });
  });

  test('400 when required fields are empty-ish', async () => {
    const req = mockRequest({
      title: '',
      requirements: '',
      acceptanceCriteria: '',
    });
    const res = mockResponse();

    await createrequirement(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Title, requirements, and acceptance criteria are required.',
    });
    expect(createRequirementMock).not.toHaveBeenCalled();
  });

  test('400 when assignee is not an integer-ish value', async () => {
    const req = mockRequest({
      title: 'must be numeric',
      requirements: 'lllllllll',
      acceptanceCriteria: 'kkkkkkk',
      assignee: '12.3', // not an integer
    });
    const res = mockResponse();

    await createrequirement(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid assignee ID: must be a valid integer',
    });
    expect(createRequirementMock).not.toHaveBeenCalled();
  });

  test('500 when the model layer explodes', async () => {
    const req = mockRequest({
      title: 'Anything',
      requirements: 'Still anything',
      acceptanceCriteria: 'Yup',
    });
    const res = mockResponse();

    createRequirementMock.mockRejectedValue(new Error('boom'));

    await createrequirement(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Server error during requirement creation',
    });
  });
});

describe('getRequirementByIdController', () => {
  test('400 for a non-numeric id', async () => {
    const req = mockRequest({}, { id: 'xyz' });
    const res = mockResponse();

    await getRequirementByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid requirement id' });
    expect(getRequirementByIdMock).not.toHaveBeenCalled();
  });

  test('404 when nothing is found', async () => {
    const req = mockRequest({}, { id: '404' });
    const res = mockResponse();

    getRequirementByIdMock.mockResolvedValue(null);

    await getRequirementByIdController(req, res);

    expect(getRequirementByIdMock).toHaveBeenCalledWith(404);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Requirement not found' });
  });

  test('200 with the row when found', async () => {
    const req = mockRequest({}, { id: '73' });
    const res = mockResponse();

    const row = { id: 73, title: 'Refactor notifications' };
    getRequirementByIdMock.mockResolvedValue(row);

    await getRequirementByIdController(req, res);

    expect(getRequirementByIdMock).toHaveBeenCalledWith(73);
    expect(res.json).toHaveBeenCalledWith(row);
  });

  test('500 when model throws', async () => {
    const req = mockRequest({}, { id: '9' });
    const res = mockResponse();

    getRequirementByIdMock.mockRejectedValue(new Error('db oops'));

    await getRequirementByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Server error during requirement fetch',
    });
  });
});

describe('updateRequirementController', () => {
  test('400 for goofy id', async () => {
    const req = mockRequest({}, { id: 'not-a-number' });
    const res = mockResponse();

    await updateRequirementController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid requirement id' });
    expect(updateRequirementMock).not.toHaveBeenCalled();
  });

  test('404 when update returns falsy', async () => {
    const req = mockRequest(
      {
        title: 'Rename queues',
        requirements: 'Shorten queue names and add tags',
        acceptanceCriteria: 'No collisions; old links redirect',
        reach: '15',
        impact: '4',
        confidence: '66',
        effort: '3',
      },
      { id: '10' }
    );
    const res = mockResponse();

    updateRequirementMock.mockResolvedValue(0);

    await updateRequirementController(req, res);

    expect(updateRequirementMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 10,
        tenantId: 4321,
        reach: 15,
        impact: 4,
        confidence: 66,
        effort: 3,
      })
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Requirement not found' });
  });

  test('200 on success + numeric coercion', async () => {
    const req = mockRequest(
      {
        title: 'Self-serve exports',
        requirements: 'Users can download CSV for last 90 days',
        acceptanceCriteria: 'Exports complete < 30s; rate-limited',
        reach: '1200',
        impact: '5',
        confidence: '88',
        effort: '13',
        area: 'Analytics',
      },
      { id: '112' }
    );
    const res = mockResponse();

    updateRequirementMock.mockResolvedValue(1);

    await updateRequirementController(req, res);

    expect(updateRequirementMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 112,
        tenantId: 4321,
        title: 'Self-serve exports',
        requirements: 'Users can download CSV for last 90 days',
        acceptanceCriteria: 'Exports complete < 30s; rate-limited',
        reach: 1200,
        impact: 5,
        confidence: 88,
        effort: 13,
        area: 'Analytics',
      })
    );
    expect(res.json).toHaveBeenCalledWith({ message: 'Requirement updated successfully' });
  });

  test('500 when update throws', async () => {
    const req = mockRequest(
      { title: 'X', requirements: 'Y', acceptanceCriteria: 'Z' },
      { id: '13' }
    );
    const res = mockResponse();

    updateRequirementMock.mockRejectedValue(new Error('nope'));

    await updateRequirementController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Server error during requirement update',
    });
  });
});
