
import { connectDB, mssql } from '../../config/dbconfig.js';

//This model is used to update requirment status
export const updateRequiremnetStatus = async (tenantId,requirementId,status) => {
  const pool = await connectDB();
  try{
  const result = await pool.request()
    .input('tenantId', mssql.UniqueIdentifier, tenantId)
    .input('requirementId', mssql.Int, requirementId)
    .input('status', mssql.NVarChar, status)


    //Databse query
    .query(`
    UPDATE dbo.requirements
        SET status = @status
        WHERE tenant_id = @tenantId
        AND requirement_id = @requirementId
    `);
  return result.recordset;
    }
    catch(error){console.error("Query for board requirement failed",error);
    
      
    }
};
