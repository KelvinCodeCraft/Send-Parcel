import dotenv from 'dotenv'
import path from 'path'
import mssql from 'mssql'

dotenv.config({path:path.resolve(__dirname,'../../.env')})


// database config
const DBconfig = {
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    server:'localhost',
    port: 1433,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: false, 
      trustServerCertificate: true,
    }
  }


  export default DBconfig