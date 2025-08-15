import mysql from "mysql2/promise";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const pool = mysql.createPool({
  host: process.env.MYSQL_ADDON_HOST,     
  port: process.env.MYSQL_ADDON_PORT,      
  user: process.env.MYSQL_ADDON_USER,  
  password: process.env.MYSQL_ADDON_PASSWORD, 
  database: process.env.MYSQL_ADDON_DB     
});

export default pool;