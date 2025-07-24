// authModel.js
import { connectDB, mssql } from '../../config/dbconfig.js';


export const findUserByEmail = async (email) => {
  const pool = await connectDB();
  const result = await pool.request()
    .input('email', mssql.VarChar, email)
    .query('SELECT * FROM users WHERE email = @email');
  return result.recordset[0];
};

export const createUser = async ({ tenant, fullname, email, password }) => {
  const pool = await connectDB();
  await pool.request()
    .input('tenant', mssql.VarChar, tenant)
    .input('fullname', mssql.VarChar, fullname || null)
    .input('organisation', mssql.VarChar, organisation || null)
    .input('email', mssql.VarChar, email)
    .input('password', mssql.VarChar, password)
    .query(`
      INSERT INTO users (tenant, fullname, organisation, email, password)
      VALUES (@tenant, @fullname, @organisation, @email, @password)
    `);
};
