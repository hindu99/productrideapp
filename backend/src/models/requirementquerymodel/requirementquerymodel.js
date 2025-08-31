
import { connectDB, mssql } from '../../config/dbconfig.js';

//This model is used to get requirements based on tenantId & projectId from the database
export const getAllRequirementsModel = async (tenantId,projectId) => {
  const pool = await connectDB();
  const result = await pool.request()
    .input('tenantId', mssql.UniqueIdentifier, tenantId)
    .input('projectId', mssql.Int, projectId)
    //Databse query
    .query(`
      SELECT requirement_id AS id,title,status
      FROM dbo.requirements
      WHERE tenant_id = @tenantId
      AND project_id=@projectId
      AND status IN ('In Backlog','In Development','In Test','Completed')
      ORDER BY status, requirement_id ASC
    `);
  return result.recordset;
};
