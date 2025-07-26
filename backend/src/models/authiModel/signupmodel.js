// authModel.js
import { connectDB, mssql } from '../../config/dbconfig.js';



export const findUserByEmail = async (email) => {
  const pool = await connectDB();
  const result = await pool.request()
    .input('email', mssql.VarChar, email)
    .query('SELECT * FROM users WHERE email = @email');
  return result.recordset[0];
};

export const createUser = async ({ tenantId, fullname, email, password }) => {
  const pool = await connectDB();
  await pool.request()
    .input('tenantID', mssql.VarChar, tenantId )
    .input('fullname', mssql.VarChar, fullname )
    .input('email', mssql.VarChar, email)
    .input('password', mssql.VarChar, password)
    .query(`
      INSERT INTO users (tenant_id,fullname,email, password)
      VALUES (@tenantID, @fullname, @email, @password)
    `);
};

export const createtenant= async ({tenantId,tenantName,category})=>{
  const pool =await connectDB();
  await pool.request()
  .input('tenantID',mssql.VarChar,tenantId)
  .input('tenantName',mssql.VarChar,tenantName)
  .input('category',mssql.VarChar,category)

  .query(
    `INSERT INTO tenant (tenant_id,tenantname, category)
      VALUES (@tenantID,@tenantName, @category)`
  );


}
