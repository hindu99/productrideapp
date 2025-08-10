
import { connectDB, mssql } from '../../config/dbconfig.js';


export const createRequirement = async ({  title,
      requirements,
      acceptanceCriterias,
      sprint,
      assignee,
      status,
      reach,
      impact,
      confidence,
      effort,
      area }) => {
  const pool = await connectDB();
  await pool.request()
    .input('requirements', mssql.NVarChar, requirements )
    .input('acceptanceCriterias', mssql.NVarChar, acceptanceCriterias )
    .input('assignee', mssql.VarChar, assignee)
    .input('status', mssql.VarChar, status )
    .input('reach', mssql.VarChar, reach)
    .input('impact', mssql.VarChar, impact)
    .input('confidence', mssql.VarChar, confidence )
    .input('effort', mssql.VarChar, effort)
    .input('area', mssql.VarChar, area)
    .query(`
      INSERT INTO requirements (ai_refined_requirement,acceptance_criteria,email, password)
      VALUES (@requirements, @fullname, @email, @password)
    `);
};



