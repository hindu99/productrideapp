
import { connectDB, mssql } from '../../config/dbconfig.js';

//This model is used to get project filtered based on the tenantID
export const getAllProjects = async (tenantId) => {
  const pool = await connectDB();
  const result = await pool.request()
  //tenantId is collected from JWT in request
    .input('tenantId', mssql.UniqueIdentifier, tenantId)
    //Database query
    .query(`
      SELECT project_id, project_name
      FROM dbo.projects
      WHERE tenant_id = @tenantId
    `);
  return result.recordset;
};
