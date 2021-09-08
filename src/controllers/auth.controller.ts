import { Request, Response } from 'express'
import response from '../helpers/response'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { createUser, getUserByEmail, updateUser } from '../models/user.model'
import { totp } from 'otplib'
import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config()

export const register = async (req: Request, res: Response) => {
  const data = req.body
  data.password = await bcrypt.hash(data.password, await bcrypt.genSalt())
  await createUser(data)
  return response(res, 'Register SuccesFully, You can Login Now', 200)
}

export const login = async (req: Request, res: Response) => {
  const data = req.body
  const results: any = await getUserByEmail(data)
  // const results = await getUserByEmail(data)

  if (results.length < 1) {
    return response(res, 'Email not found', 401)
  }
  const user = results[0][0]
  // const result: any = results[0]
  // const user = result[0]

  const compare = await bcrypt.compare(data.password, user.password)
  if (compare) {
    const token = jwt.sign(
      { id: user.id, email: user.email, position: user.position },
      process.env.APP_KEY as string
    )
    return response(res, 'Login Success', 200, { token })
  } else {
    return response(res, 'Wrong Email or Password!', 401)
  }
}

export const reqOtp = async (req: Request, res: Response) => {
  const body = req.body
  totp.options = {
    digits: 6,
    step: 60 * 5,
  }
  const token = totp.generate(process.env.OTP_KEY as string)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: body.email,
    subject: 'OTP (One Time Password)',
    text: `This is shown if you request to reset your password OTP : ${token}`,
  })
  try {
    if (info.messageId) {
      const message = {
        otp: token,
        note: 'This is for development only!',
      }
      return response(res, 'success', 201, message)
    }
  } catch (error) {
    const msg = 'Request OTP failed. Please try again.'
    return response(res, msg, 500)
  }
}

export const resetPass = async (req: Request, res: Response) => {
  const body = req.body
  if (body.otp) {
    const isValid = totp.check(body.otp, process.env.OTP_KEY as string)
    if (!isValid) {
      return response(res, 'otp is not valid', 400)
    } else {
      const results: any = await getUserByEmail(body)
      // const results = await getUserByEmail(data)
      if (results.length < 1) {
        return response(res, 'Email not found', 401)
      } else {
        body.password = await bcrypt.hash(body.password, await bcrypt.genSalt())
        await updateUser(body)
        return response(
          res,
          `Success reset password account ${body.email}`,
          200
        )
      }
    }
  } else {
    const msg = 'otp doesnt exists!'
    return response(res, msg, 400)
  }
}
