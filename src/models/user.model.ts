import db from '../helpers/db'
import { Register, Login } from '../types/user.type'

const table = 'users'

export const createUser = async (data: Register) => {
  return (await db).execute(
    `
    INSERT INTO ${table} (email, phone_number, password) VALUES (?, ?, ?)
      `,
    [data.email, data.phone_number, data.password]
  )
}

export const updateUser = async (data: Register) => {
  return (await db).execute(
    `
    UPDATE ${table} SET password = ? WHERE email = ?
      `,
    [data.password, data.email]
  )
}

export const getUserByEmail = async (data: Login) => {
  return (await db).execute(
    `
      SELECT id, email, phone_number, password FROM ${table} WHERE email = ?
    `,
    [data.email]
  )
}
