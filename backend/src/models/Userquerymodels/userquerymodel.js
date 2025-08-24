
import { connectDB, mssql } from '../../config/dbconfig.js';

//This model is used to get all the users from the data
export const getAllUsersModel = async (tenantId) => {
  const pool = await connectDB();
  const result = await pool.request()
    .input('tenantId', mssql.UniqueIdentifier, tenantId)
    //Databse query
    .query(`
      SELECT user_id, fullname
      FROM users
      WHERE tenant_id = @tenantId
    `);
  return result.recordset;
};

