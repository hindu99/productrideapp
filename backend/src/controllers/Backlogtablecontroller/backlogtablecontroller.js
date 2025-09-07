// Controller functions for handling backlogtable operations
// This file contains logic for managing backlogtabledata


import { getAllBacklogItems } from '../../models/backlogtablemodel/backlogmodel.js';

//This function get the tenantId from tokern and ProjectId from local storage and pass it to the SQL model

export const getAllbacklogitmes = async (req, res) => {
  try {
    // also check req.auth as some auth middlewares attach token data here
    const tenantId  = req.user?.tenantId  || req.auth?.tenantId || req.query.tenantId;
    const projectId = req.query.projectId ?? req.projectId;
    console.log(projectId) 

    if (!tenantId)  return res.status(400).json({ message: 'Unauthorised request' });
    if (!projectId) return res.status(400).json({ message: 'Please provide projectId' });

    //SQL query for getting requirments executed here using getAllBacklogItems

    const rows = await getAllBacklogItems(tenantId, Number(projectId));

    // Flat array;this code is collecting the data into a array for sending it to backlog table 
    const requirementforboard = rows.map(r => ({
      id: r.id,
      title: typeof r.title === 'string' ? r.title.trim() : r.title,
      sprint: r.sprint ?? null,
      riceScore: r.riceScore != null ? Number(r.riceScore) : null,
    }));
    return res.status(200).json(requirementforboard);
  } catch (error) {
    console.error('Error fetching requirements:', error);
    return res.status(500).json({ message: 'Error fetching requirements' });
  }
};
