import {body , validationResult} from 'express-validator'

export const handleInputErrors = (req , res , next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.status(400).json({errors:errors.array()})
    } else {
        next()
    }
}

export const checkForEmptyAndString = (field) =>{
    return body(`${field}`,`the ${field} can't be Empty! `).notEmpty().isString().withMessage(`The ${field} must be string!`)

}

export const checkForAdmin = (req,res ,next) => {
    if(req.body.isAdmin === "true"){
        return res.status(400).json({message:"You can't create an admin!"})
    } else {
        next()
    }
}