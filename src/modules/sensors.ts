import { initializeApp , applicationDefault } from "firebase-admin/app";
import {getMessaging}  from 'firebase-admin/messaging'
import prisma from "../db";
import { token } from "morgan";
import { title } from "process";
import { body } from "express-validator";

process.env.GOOGLE_APPLICATION_CREDENTIALS;

initializeApp({
    credential: applicationDefault() ,
    projectId: 'parking-system-ba4c0'
})


/**
 * get the changed slot and wheter its full or empty
 * search for the userId attached to the slot and get the FCM token 
 * send him a message that the  car took the slot if it's full or that the car is moving if it's empty
 * 
 */

export const getSensorData = async (req , res) => {
    try {
        console.log("works!")
        const slotNumber = req.body.slotNumber;
    
        const slot = await prisma.slot.findUnique({
            where:{
                code: slotNumber
            } ,
            include:{
                user: true
            }
        })

        const fcm = slot.user.FCMtoken;
        if(!fcm) {
            return res.status(400).json({message: "This user has no FCM!!"})
        }

        if(req.body.status === true) {
            const message = {
                notification: {
                    title: "Car Alert!!",
                    body:"There is a car parking in your slot , Is That You?!"
                } ,
                token: fcm
            }
           const response = await getMessaging().send(message)
           console.log("successfully sent message:" , response )
           res.status(200).json({message:"User is Informed!!"})

        } else if(req.body.status === false) {
            const message = {
                notification: {
                    title: "Car Alert!!",
                    body: "Your Car is moving out of the slot , was that you ?"
                } ,
                token: fcm
            }

            const response = await getMessaging().send(message)
            console.log("successfully sent message:" , response )
            res.status(200).json({message:"User is Informed!!"})

        }

        


        
        
    } catch (e) {
        console.error(e)
        res.status(400).json({message :"Something went wrong"})
    }
}


/*
export const getSensorData =  (req, res) => {
    console.log("Sensor data :" , req.body)
    const io = req.app.get('socketio')
    io.emit('sensorData' , req.body);
    console.log("works!")
    return res.status(200).json({data: req.body})
}