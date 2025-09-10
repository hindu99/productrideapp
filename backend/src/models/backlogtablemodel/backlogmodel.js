import { connectDB, mssql } from '../../config/dbconfig.js';

//This model is used to get requirements based on tenantId & projectId from the database 
// It is slelcting title,sprint and ricescore and ordering the list by the ricescore 
export const getAllBacklogItems = async (tenantId,projectId) => {
  const pool = await connectDB();
  const result = await pool.request()
    .input('tenantId', mssql.UniqueIdentifier, tenantId)
    .input('projectId', mssql.Int, projectId)
    //Databse query
    .query(`
SELECT
        r.requirement_id AS id,
        r.title          AS title,
        s.sprint_name    AS sprint,    
        r.rice_score     AS riceScore
      FROM dbo.requirements AS r
      LEFT JOIN dbo.sprints AS s
        ON  s.project_id = r.project_id
        AND s.sprint_id  = r.sprint_id  
      WHERE r.tenant_id  = @tenantId
        AND r.project_id = @projectId
        AND r.status     = 'In Backlog'
      ORDER BY r.rice_score DESC
    `);
  return result.recordset;
};
