import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'
dotenv.config()

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  port: 3306,
})

export default db
