// models/requirementmodel/requirementdatahandlingmodel.js
// This file contains model functions for handling requirement data in the backend.
// Use this file to define database operations related to requirements, such as creating, updating, retrieving, or deleting requirement records.
// Keep all business logic and data access for requirements organized here for maintainability and separation of concerns.

import { connectDB, mssql } from '../../config/dbconfig.js';

export const createRequirement = async ({
  title,
  requirements,
  acceptanceCriteria,
  sprint,
  tenantId,
  userId,
  assignee, // should be user.id
  project,
  status,
  reach,
  impact,
  confidence,
  effort,
  area
}) => {
  const pool = await connectDB();

  await pool.request()
    .input('title', mssql.NVarChar(255), title)
    .input('requirements', mssql.NVarChar(mssql.MAX), requirements)
    .input('acceptanceCriteria', mssql.NVarChar(mssql.MAX), acceptanceCriteria)
    .input('sprintId', mssql.Int, sprint || null) 
    .input('tenantId', mssql.UniqueIdentifier, tenantId) 
    .input('userId', mssql.Int, userId)
    .input('assigneeId', mssql.Int, assignee || null)
    .input('projectId', mssql.Int, project || null)
    .input('status', mssql.NVarChar(50), status)
    .input('reach', mssql.Int, reach)
    .input('impact', mssql.Int, impact)
    .input('confidence', mssql.Int, confidence)
    .input('effort', mssql.Int, effort)
    .input('area', mssql.NVarChar(255), area || null)
    .query(`
      INSERT INTO requirements 
      (title, ai_refined_description, acceptance_criteria, sprint_id,tenant_id,created_by, assignee_id,project_id, status, reach, impact, confidence, effort, area)
      VALUES 
      (@title, @requirements, @acceptanceCriteria, @sprintId,@tenantId,@userId, @assigneeId,@projectId, @status, @reach, @impact, @confidence, @effort, @area)
    `);
};

//This model is used for getting the requirment from the databse based on the Id
//id is passed from the kanbanboard
//so this is used when kanbanboard is clicked, kanban board pass the id to requirmentpage and the the request is made to populate data 
export const getRequirementById = async (id) => {
  const pool = await connectDB();

  const result = await pool.request()
    .input('id', mssql.Int, id)
    .query(`
      SELECT 
        requirement_id AS id, 
        title, 
        ai_refined_description AS requirements, 
        acceptance_criteria AS acceptanceCriteria,
        sprint_id AS sprint,
        assignee_id AS assignee,
        project_id AS project,
        status,
        reach,
        impact,
        confidence,
        effort,
        area,
        tenant_id AS tenantId,
        created_by AS userId
      FROM dbo.requirements
      WHERE requirement_id = @id  
    `);

  return result.recordset[0]; // return single requirement row
};
