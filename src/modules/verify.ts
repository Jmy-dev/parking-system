import nodemailer from 'nodemailer'
import randomString from 'randomstring'
import prisma from '../db'




function createOTP() {

    return randomString.generate({length:5 , charset:'numeric'})
  }
  

async function sendOTP (email , otp) {
    const mailOptions = {
        from: 'ahmedleagelol@gmail.com' ,
        to: email ,
        subject: `One-Time Password (OTP) Verification` ,
        text: `Your One-Time Password (OTP) is: ${otp}`
    }
    let transporter =  nodemailer.createTransport({
        service: 'Gmail' ,
        auth: {
            user:'ay9122000@gmail.com' ,
            pass: 'wbhn kjkb kdec uijr'
        } ,
        tls: {
            rejectUnauthorized: false
        }
    });
    await transporter.sendMail(mailOptions , (error,info) => {
        if(error) {
            console.error('error:' , error)
        } else {
            console.log('OTP email sent successfully' , info.response)
        }

    })

  }

export const requestOTP = async (req , res) => {
    try {
        const {email , userId} = req.body;
        const otp = createOTP();
        const createdOTP = await prisma.oTP.create({
            data:{
                content: Number(otp) ,
                userId
            }
        })
    
        if(!createdOTP) {
            return res.status(400).json({message:"Couldn't create the otp!"})
        }
       
    
        await sendOTP(email , otp);
        res.status(200).json({message: 'OTP sent'})
        
    } catch (e) {
        console.error(e)
        res.status(400).json({message:"Error creating the otp"})
    }
}

export const verifyOTP = async (req , res) => {
    try {
        const {otp,email} = req.body;

        const user = await prisma.user.findUnique({
            where:{
                email
            } , 
            include:{
                otp: true
            }
            
        }) 
        if(!user) {
            return res.status(400).json({message:"This email doesn't exist"})
        }

        if(otp === user.otp.content) {
            const updatedUser = await prisma.user.update({
                where:{
                    email
                } ,
                data: {
                    isVerified: true
                }
            })
            if(!updatedUser) {
                return res.status(400).json({message:"couldn't update the user!!"})
            }
            res.status(200).json({message: "email is verified!!"})
        }

        
    } catch (e) {
        console.error(e)
        res.status(400).json({message:"Error verifying otp"})
        
    }
}




































  

/*export const SendOTP = async (req, res) => {
    const mailOptions = {
        from: 'ahmedleagelol@gmail.com' ,
        to: req.body.email ,
        subject: `One-Time Password (OTP) Verification` ,
        text: `Your One-Time Password (OTP) is: ${otp}`
    }
    const result = await transporter.sendMail(mailOptions , (err , response) => {
        if(err) {
            console.log(err);
            return res.status(400).json({message: "Email not confirmed"})
        } else {
            console.log(response)
            res.status(200).json({"sent":result})
        }

    })

}

export const verifyOTP = async (req , res) => {
    const
}
*/