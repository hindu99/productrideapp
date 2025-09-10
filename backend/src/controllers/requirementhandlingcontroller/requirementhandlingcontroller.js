// controllers/requirements/requirements.controller.js
import dotenv from 'dotenv';
import { createRequirement, getRequirementById,updateRequirement} from '../../models/requirementmodel/requirementdatahandlingmodel.js';
// Load environment variables
dotenv.config();

// Controller function to create a requirement
export const createrequirement = async (req, res) => {
  // Extract requirement details from request body
  const {
    title,
    requirements,
    acceptanceCriteria,
    sprint,
    assignee,
    project,
    status,
    reach,
    impact,
    confidence,
    effort,
    area
  } = req.body;
  console.log(req.body)
  // tenandId is collected from request
  const tenantId = req.tenantId;
  const userId=req.userId;

  // Validate required fields
  if (!title || !requirements || !acceptanceCriteria) {
    return res.status(400).json({ message: 'Title, requirements, and acceptance criteria are required.' });
  }
  const assigneeId = assignee ? Number(assignee) : null;

  // Validate assigneeId is an integer number if provided
  if (assignee && (isNaN(assigneeId) || !Number.isInteger(assigneeId))) {
    return res.status(400).json({ message: 'Invalid assignee ID: must be a valid integer' });
  }

  try {
    // Create requirement in DB
    await createRequirement({
      tenantId,
      userId,
      title,
      requirements,
      acceptanceCriteria,
      sprint,
      assignee,
      project,
      status,
      reach: Number(reach) || 0,
      impact: Number(impact) || 0,
      confidence: Number(confidence) || 0,
      effort: Number(effort) || 0,
      area
    });

    // Success response
    res.status(201).json({ message: 'Requirement created successfully' });
  } catch (error) {
    console.error('Requirement Creation Error:', error);
    res.status(500).json({ message: 'Server error during requirement creation' });
  }
};

// Controller to fetch a requirement by id (used when clicking a Kanban card)
export const getRequirementByIdController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid requirement id' });
    }

    const row = await getRequirementById(id);
    if (!row) {
      return res.status(404).json({ message: 'Requirement not found' });
    }
    res.json(row);
  } catch (error) {
    console.error('Get Requirement Error:', error);
    res.status(500).json({ message: 'Server error during requirement fetch' });
  }
};

// New controller for updating the requirment when editing 
export const updateRequirementController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'Invalid requirement id' });
    }

    const {
      title,
      requirements,
      acceptanceCriteria,
      sprint,
      assignee,
      project,
      status,
      reach,
      impact,
      confidence,
      effort,
      area
    } = req.body;

    const tenantId = req.tenantId;

    const ok = await updateRequirement({
      id,
      tenantId,
      title,
      requirements,
      acceptanceCriteria,
      sprint,
      assignee,
      project,
      status,
      reach: Number(reach) || 0,
      impact: Number(impact) || 0,
      confidence: Number(confidence) || 0,
      effort: Number(effort) || 0,
      area
    });

    if (!ok) return res.status(404).json({ message: 'Requirement not found' });
    res.json({ message: 'Requirement updated successfully' });
  } catch (error) {
    console.error('Requirement Update Error:', error);
    res.status(500).json({ message: 'Server error during requirement update' });
  }
};
