import prisma from '../db'
import { comparePassword, hashPassword, newtoken } from '../modules/auth'
import {createOTP , sendOTP} from '../modules/verify'

export const createNewUser = async (req , res ) => {
    try {
        const existUsernameOrPassword = await prisma.user.findFirst({
            where: {
                OR :[
                    {
                        username:req.body.username
                    } , {
                        email:req.body.email
                    }      
                    
                ]
            }
        })

        if(existUsernameOrPassword) {
            return res.status(400).json({message:"username and email must be unique!!"})
        } 
        const user = await prisma.user.create({
            data:{
                username: req.body.username ,
                password: await hashPassword(req.body.password),
                email: req.body.email ,
                carType: req.body.carType ,
                mobileNumber: req.body.mobileNumber
            }
        })
        const token = await newtoken(user)
        const data = {
            token: token,
            id:user.id,
           isAdmin: user.isAdmin ,
            isVerified:user.isVerified
        }
        res.status(201).json(data)
        
    } catch (e) {
        console.error(e);
        res.status(400).end()
        
    }
}

export const signin = async (req , res)  => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email:req.body.email
            }
        })
    
        if(!user) {
            return res.status(400).json({message:"You need to register first in order to signin "})
        }
    
        const match = await comparePassword(req.body.password , user.password);
    
        if(!match) {
            return res.status(400).json({message: "Incorrect Password"})
        }
        const token = await newtoken(user)
        const data = {
            token: token,
            id:user.id,
           isAdmin: user.isAdmin ,
            isVerified:user.isVerified
        }
    
        res.status(200).json(data)
        
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }

}

export const getAllusers = async (req , res ) => {
    try {
        if(!req.user.isAdmin) {
            return res.status(400).json({message:"You are not authorized to perform such an action!!"})

        }
        const users = await prisma.user.findMany({
            select:{
                id: true,
                isAdmin:true,
                username: true ,
                points: true ,
                email: true ,
                mobileNumber: true,
                carType:true ,
                isVerified:true
             }
        });

        res.status(200).json({data:users})

        
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const getCurrentUser = async (req , res) =>{
    try {
        const user = await prisma.user.findUnique({
            where: {
                id:req.user.id
            } ,
            select:{
               id: true,
               isAdmin:true,
               username: true ,
               points: true ,
               email: true ,
               mobileNumber: true,
               carType:true ,
               isVerified:true
            }
            

        })

         res.status(200).json({data:user})
        
        
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const updateUser = async (req , res) => {
    try {
        if(req.user.isAdmin || (req.params.id === req.user.id)) {
            console.log( req.user.isAdmin)
            if((req.user.isAdmin === false) &&( (req.body.points) && (!req.body.payment))) {
                console.log("works!!")
                return res.status(401).json({message:"You are not authorized to perform such an action!!"})
            }
            
            const user = await prisma.user.findUnique({
                where:{
                    id:req.params.id 
                }
            })
            if(!user) {
                return res.status(400).json({message: "There is no such a user!"})
            }
    
            //needs security
            const updatedUser = await prisma.user.update({
                where:{
                    id:req.params.id
                } ,
                data:{
                    carType: req.body.carType ,
                    points:   req.body.points ,
                    slot:req.body.slot
    
                }
            })

            if(!updatedUser) {
                return res.status(400).end()
            }
             res.status(200).json({data:updatedUser})
        } else {
            return res.status(401).json({message: "You are not authorized to perfom such an action"})
        }
        
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const deleteUser = async (req , res) =>{
    try {
        if(req.user.isAdmin || (req.params.id === req.user.id)) {
            const deletedUser = await prisma.user.delete({
                where: {
                    id: req.params.id
                }
            })
            if(!deletedUser) {
                return res.status(400).json({message:"There is no such a user to delete!"})
            }
            res.status(200).json({data:deletedUser})

        } else {
            return res.status(401).json({message:"You are not authorized to perform such an action!"})
        }
        
    } catch (e) {
        console.error(e)
        res.status(400).end()
    }
}

export const getSpecificUser = async (req , res) =>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                id: req.params.id
            }
        })
        if(!user) {
            return res.status(400).json({message:"User is not found!"})
        }
        res.status(200).json({data:user})
        
    } catch (e) {
        console.error(e);
        res.status(400).end()
    }

}

export const forgetPassword = async (req , res) => {
    try {
        
        //check if email already exists in database 
        const exists = await prisma.user.findUnique({
            where:{
                email:req.body.email
            }
        })
        if(!exists) {
            return res.status(400).json({message: "This email doesn't exist!"})
        }
        //create and send an otp to the email 
        const otp = createOTP()
        await sendOTP(req.body.email , otp);
        //update user's otp
        const updatedOTP = await prisma.oTP.update({
            where:{
                userId:exists.id
            } ,
            data:{
                content:Number(otp)
            }
        })
        if(!updatedOTP) {
            return res.status(400).json({message:"Couldn't update the otp for the user"})
        }
        res.status(200).json({message: 'OTP sent'})
    } catch (e) {
        console.error(e)
        res.status(400).json({message:"Something went wrong in the forget password process!"})
    }

    //w8 for the user to send back the otp 
    //if the otp is correct just let him change the password 
    //if not just return 400
}
export const resetpassword = async (req , res) => {
    try {
        const { email, newPassword} = req.body;
    
        const user = await prisma.user.findUnique({
            where:{
                email
            } 
        })
        if(!user ) {
            res.status(400).json({message:"this email doesn't exist!"})
        }
        
            const updatedUser = await prisma.user.update({
                where:{
                    email
                } ,
                data:{
                    password: await hashPassword(newPassword)
                }
            })
    
            return res.status(201).json({message: "Password changed successfully!"})
    
         
        
    } catch (e) {
        console.error(e)
        res.status(400).json({message: "Something went wrong while reseting the password!"})
        
    }

}