// Controller for handling Kanban board card position updates
// This file contains logic for updating the position of cards within and between columns on the Kanban board
// Functions here should handle requests to move cards, update their order, and persist changes to the database
// Keep all card position update logic organized here for maintainability and separation of concerns


import { updateRequiremnetStatus } from '../../models/Boardmodels/cardupdatemodel.js';


/**
 * updatecardstatus
 * Updates the status of a Kanban card (requirement) for a given tenant.
 * Expects tenantId (from user or query), requirementId (from body), and new status (from body).
 * Returns 204 on success, 400 for bad requests, and 500 for server errors.
 */
export const updatecardstatus = async (req, res) => {
  try {
    const tenantId  = req.user?.tenantId  || req.query.tenantId;
    const requirementId = Number(req.body?.id);
    const status=req.body?.status;
    console.log(requirementId); 

    if (!tenantId)  return res.status(400).json({ message: 'Unauthorised request' });
    if (!requirementId) return res.status(400).json({ message: 'Not a valid requirment' });
    if (!status) return res.status(400).json({ message: 'Not a valid status' });

    // Update the requirement status in the database
    const rows = await updateRequiremnetStatus(tenantId, requirementId, status);

    // No content response for successful update
    return res.status(204);
  } catch (error) {
    console.error('Error fetching requirements:', error);
    return res.status(500).json({ message: 'Error fetching requirements' });
  }
};
