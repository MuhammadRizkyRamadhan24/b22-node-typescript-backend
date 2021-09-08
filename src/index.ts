import express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()
const app = express()

import router from './routes'
app.use(express.urlencoded({ extended: false }))
app.use('/', router)

const port = process.env.PORT

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`App listening on port ${port}`)
})
