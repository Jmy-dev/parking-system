import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const comparePassword = async(password  , hash) => {
    return bcrypt.compare(password , hash)
}
export const hashPassword = async (password) => {
    return await bcrypt.hash(password , 5)
}

export const newtoken = async(user) => {
    const token =  await jwt.sign({
        id:user.id ,
        username: user.username ,
        isAdmin: user.isAdmin ,
        isVerified: user.isVerified
    } , process.env.JWT_SECRET
)
    return token
}

export const protect = (req ,res , next) =>{
    
    const bearer = req.headers.authorization;

    if(!bearer) {
        return res.status(401).json({message:"Not authorized!"})
    }

    const [, token] = bearer.split(' ')
    if(!token) {
        return res.status(401).json({message:"Not a Valid token!"})
    }
    const payload = jwt.verify(token , process.env.JWT_SECRET)

    req.user = payload;
    
    next()
} 

export const checkForEmailVerification = (req , res , next) => {
    if(req.user.isVerified === false) {
        return res.status(401).json({message:"You need to be verified in order to use the apis!!"})
    }
    next()

}