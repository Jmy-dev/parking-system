import express from 'express'
import router from './router'
import morgan from 'morgan'
import cors from 'cors'
import { checkForEmailVerification, protect } from './modules/auth'
import { createNewUser, signin } from './handlers/user'
import { checkForAdmin, checkForEmptyAndString, handleInputErrors} from './modules/middlewares'
import { requestOTP, verifyOTP } from './modules/verify'
import { body } from 'express-validator'



const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.get('/' , (req, res) => {
  res.status(200).json({message: "Welcome to the Parking System"})
})
app.use('/api' , protect, checkForEmailVerification , router)
app.post('/signin' ,
checkForEmptyAndString('email') ,
checkForEmptyAndString('password'),
handleInputErrors,
 signin)
app.post('/register',
  checkForAdmin,
  checkForEmptyAndString('username'),
  checkForEmptyAndString('password'),
  checkForEmptyAndString('mobileNumber'),
  checkForEmptyAndString('carType') ,
  checkForEmptyAndString('email'),
  handleInputErrors,
  createNewUser )
 app.post('/getOTP' ,
    checkForEmptyAndString('email'),
    checkForEmptyAndString('userId'),
    handleInputErrors,
    requestOTP

  )
  app.post('/verifyOTP' ,
  checkForEmptyAndString('email'),
  body('otp',"the otp can't be empty").notEmpty(),
  handleInputErrors ,
  verifyOTP
  )

export default app;