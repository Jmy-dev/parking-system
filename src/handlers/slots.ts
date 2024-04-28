import prisma from '../db'



export const getAllSlots = async (req , res) => {
    try {
        const slots = await prisma.slot.findMany({})

        res.status(200).json({data:slots})
        
    } catch (e) {
        console.error(e)
        res.status(400).json({error: e})
    }

}

export const getAllAvailableSlots = async (req , res) => {

    try {
        const slots = await prisma.slot.findMany({
            where:{
                isFree: true
            }
        })

        if(slots.length === 0) {
            return res.status(200).json({message: "There is no available slots!"})
        }
        res.status(200).json({data : slots})
        
    } catch (e) {
        console.error(e)
        res.status(400).json({error: e})
    }

}

export const getOneSlot = async (req , res) => {
    try {
        const slot = await prisma.slot.findUnique({
            where:{
                id: req.params.id
            } ,
            include:{
                user:true 
            }
        })

        res.status(200).json({data: slot})
        
    } catch (e) {
        console.error(e)
        res.status(400).json({error: e})
    }

}

export const createSlot = async (req , res) => {
    try {
        if(!req.user.isAdmin) {
            return res.status(401).json({message:"You are not authorized to perform such an action "})
        }
        const found = await prisma.slot.findUnique({
            where:{
                code:req.body.code
            }
        })

        if(found) {
            return res.status(400).json({message: "Code must be unique!!"})
        }
        
        const createdSlot = await prisma.slot.create({
            data:{
                code:req.body.code
            }
        })

        if(!createdSlot) {
            return res.status(400).json({message:"There was a problem creating this Slot@"})
        }

        res.status(201).json({data: createdSlot})
        
    } catch (e) {
        console.error(e)
        res.status(400).json({error: e})
    }

}

export const updateSlot = async (req , res) => {
    try {
        

        const updatedSlot = await prisma.slot.update({
            where:{
                id:req.params.id
            } ,
            data:{
                userId: req.body.userId ,
                isFree: req.body.isFree
            }
        })
        if(!updatedSlot) {
            return res.status(400).json({message:"there was a problem updating the the slot"})
        }
        res.status(200).json({data:updatedSlot})
        
    } catch (e) {
        console.error(e)
        res.status(400).json({error: e})
    }

}

export const deleteSlot = async (req , res) => {
    try {
        if(!req.user.isAdmin) {
            return res.status(401).json({message:"You are not authorized to perform such an action "})
        }

        const deletedSlot = await prisma.slot.delete({
            where:{
                id:req.params.id
            }
        })

        if(!deletedSlot) {
            return res.status(400).end()
        }
        res.status(200).json({data:deletedSlot})
        
    } catch (e) {
        console.error(e)
        res.status(400).json({error: e})
        
    }

}