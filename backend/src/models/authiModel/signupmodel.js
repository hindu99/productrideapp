// authModel.js
import { connectDB, mssql } from '../../config/dbconfig.js';


//Based on the email getting data from database 
export const findUserByEmail = async (email) => {
  const pool = await connectDB();
  const result = await pool.request()
    .input('email', mssql.VarChar, email)
    .query('SELECT * FROM users WHERE email = @email');
  return result.recordset[0];
};

//Create user model which creates users in database 

export const createUser = async ({ tenantId, fullname, email, password,role }) => {
  const pool = await connectDB();
  await pool.request()
    .input('tenantID', mssql.VarChar, tenantId )
    .input('fullname', mssql.VarChar, fullname )
    .input('email', mssql.VarChar, email)
    .input('password', mssql.VarChar, password)
    .input('role',mssql.NVarChar,role)
    .query(`
      INSERT INTO users (tenant_id,fullname,email, password,role)
      VALUES (@tenantID, @fullname, @email, @password,@role)
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
