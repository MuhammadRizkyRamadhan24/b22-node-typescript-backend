import { Router } from 'express'
import {
  login,
  register,
  reqOtp,
  resetPass,
} from '../controllers/auth.controller'

const auth = Router()

auth.post('/login', login)
auth.post('/register', register)
auth.post('/requestotp', reqOtp)
auth.post('/resetpassword', resetPass)

export default auth
