import { connectDB, mssql } from '../../config/dbconfig.js';

/**
 * This creates a new project in the projects table
 */
export const createProjectInDB = async ({ tenantId,userId, projectname, projectdescription }) => {
  const pool = await connectDB();
  //tenantID & userId is extracted from JWT ,project name and projectdescription is extracted from request 
  await pool.request()
  .input('tenantId', mssql.UniqueIdentifier, tenantId)
    .input('userId', mssql.Int, userId)
    .input('projectname', mssql.VarChar, projectname)
    .input('projectdescription', mssql.VarChar, projectdescription)
    //SQL query to insert the values 
    .query(`
      INSERT INTO projects (tenant_id,created_by,project_name, description)
      VALUES (@tenantId,@userId, @projectname, @projectdescription)
    `);
};
