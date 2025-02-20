
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../.env') })

let Emailconfig ={
    host:'live.smtp.mailtrap.io',
    service:'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.APP_PASS
    }
}

export default Emailconfig