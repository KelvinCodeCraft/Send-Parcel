import dotenv from 'dotenv'
import path from 'path'
import mssql from 'mssql'

dotenv.config({path:path.resolve(__dirname,'../../.env')})


// database config
const DBconfig = {
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    server:'COLLO',
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

  // async function test() {
  //   try {
  //     let pool = await mssql.connect(DBconfig)
  //     let result = await pool.request().query('select * from users')
  //     console.dir(result)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
  // test()
  export default DBconfig