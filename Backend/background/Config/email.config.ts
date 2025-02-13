
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../.env') })

let Emailconfig ={
    host:'live.smtp.mailtrap.io',
    service:'gmail',
    // port:587,
    auth:{
        user:'koechkelvin2001@gmail.com',
        pass:'eejn ubwe drgf lzyz'
    }
}

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: "ivonnenabangala@gmail.com", // Replace with your email
//         pass: "wyyo hajx lnqq zeac",   
//     },
// });

export default Emailconfig