// Controller functions for handling Kanban board operations
// This file contains logic for managing Kanban board data, such as fetching columns, updating cards, and handling drag-and-drop actions
// Keep all business logic and data access for the Kanban board organised here for maintainability and separation of concerns

import { getAllRequirementsModel } from '../../models/requirementquerymodel/requirementquerymodel.js';

//This function get the tenantId from tokern and ProjectId from local storage and pass it to the SQL model

export const getAllRequirements = async (req, res) => {
  try {
    // also check req.auth as some auth middlewares attach token data here
    const tenantId  = req.user?.tenantId  || req.auth?.tenantId || req.query.tenantId;
    const projectId = req.projectId;
    console.log(projectId) 

    if (!tenantId)  return res.status(400).json({ message: 'Unauthorised request' });
    if (!projectId) return res.status(400).json({ message: 'Please provide projectId' });

    //SQL query for getting requirments executed here using getAllRequirementsModel

    const rows = await getAllRequirementsModel(tenantId, projectId);

    // Flat array; your KanbanBoard groups this into the 4 columns
    const requirementforboard = rows.map(r => ({
      id: r.id,
      title: r.title,
      status: String(r.status).trim(),
    }));
    return res.status(200).json(requirementforboard);
  } catch (error) {
    console.error('Error fetching requirements:', error);
    return res.status(500).json({ message: 'Error fetching requirements' });
  }
};
