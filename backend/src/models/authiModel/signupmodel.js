// authModel.js
import { connectDB, sql } from '../config/db.js';

export const findUserByEmail = async (email) => {
  const pool = await connectDB();
  const result = await pool.request()
    .input('email', sql.VarChar, email)
    .query('SELECT * FROM users WHERE email = @email');
  return result.recordset[0];
};

export const createUser = async ({ tenant, fullname, organisation, email, password }) => {
  const pool = await connectDB();
  await pool.request()
    .input('tenant', sql.VarChar, tenant)
    .input('fullname', sql.VarChar, fullname || null)
    .input('organisation', sql.VarChar, organisation || null)
    .input('email', sql.VarChar, email)
    .input('password', sql.VarChar, password)
    .query(`
      INSERT INTO users (tenant, fullname, organisation, email, password)
      VALUES (@tenant, @fullname, @organisation, @email, @password)
    `);
};
