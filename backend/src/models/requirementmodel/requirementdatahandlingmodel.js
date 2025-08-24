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
    .input('assigneeId', mssql.Int, assignee)
    .input('projectId', mssql.Int, project)
    .input('status', mssql.NVarChar(50), status)
    .input('reach', mssql.Int, reach)
    .input('impact', mssql.Int, impact)
    .input('confidence', mssql.Int, confidence)
    .input('effort', mssql.Int, effort)
    .input('area', mssql.NVarChar(255), area)
    .query(`
      INSERT INTO requirements 
      (title, ai_refined_description, acceptance_criteria, sprint_id,tenant_id,created_by, assignee_id,project_id, status, reach, impact, confidence, effort, area)
      VALUES 
      (@title, @requirements, @acceptanceCriteria, @sprintId,@tenantId,@userId, @assigneeId,@projectId, @status, @reach, @impact, @confidence, @effort, @area)
    `);
};
