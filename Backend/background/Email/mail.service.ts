import ejs from 'ejs'
import sendMail from '../Helpers/email.helpers';
import mssql from 'mssql'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
import DBconfig from '../../src/Config/db-config'
import { register } from 'module';

interface User {
    id:string, 
    email:string,
    password:string,
    created_at:string,
    is_admin:string,
    is_deleted:string,
    phone: string,
    is_sent:string,
}
const sendWelcomeEmail = async () => {
    const pool = await mssql.connect(DBconfig)
    const users: User[] = (await pool.request().
        query("SELECT * FROM Users WHERE is_sent ='0'")).recordset

    for (let user of users) {
        console.log("user",user);
        ejs.renderFile('templates/registration.ejs', { name: user.email }, async (error: any, html: any) => {
            console.log("html",html);
            console.log("error",error);
            const message = {
                from: process.env.EMAIL,
                to: user.email,
                subject: "welcome to SendIt",
                html
            };
           

            try {
                await sendMail(message)
                await pool.request().query(`UPDATE Users SET is_sent ='1' WHERE id ='${user.id}'`)
            } catch (error) {
                console.log(error);

            }
        })
    }
    
}

export default sendWelcomeEmail