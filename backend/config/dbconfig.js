import { connect } from 'mssql';// Importing mssql package
import dotenv from 'dotenv';

dotenv.config(); // This is loading environment variables from .env file to process.env

// Configuration for SQL Server connection
const config = {
user:process.env.DB_USER, //dotenv.config will make the process availble , now using process.env.DB_USER can reaf the DB_USER from .env file
password:process.env.DB_PASSWORD,
server:process.env.DB_SERVER||'localhost', // first cheks DB_SERVER env var, if not set, defaults to 'localhost'
database:process.env.DB_DATABASE, // read the database name from DB_DATABASE env var
port:parseInt(process.env.DB_PORT,10)||1433, // reads DB_PORT env var or defaults to 1433
 options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

// This code sets up a connection to a SQL Server database using the mssql package.
// It reads the database connection details from environment variables defined in a .env file.

// Initialise a connection pool
//storing the connection pool in a variable
// This allows for reusing the connection pool across multiple requests

let pool;


const connectDB = async () => {
    try {
        if (!pool) {
            pool = await connect(config);
            console.log('SQL Server Connected (using pool)');
        }
        return pool;
    } catch (error) {
        console.error(`DB Connection Error: ${error.message}`);
        throw new Error('Database connection failed');
    }
};

export default { connectDB, sql, pool: () => pool };