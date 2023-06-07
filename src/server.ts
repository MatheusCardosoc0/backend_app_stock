import Express from 'express'
import ProductRoutes from './routes/Product'
import ShellRoutes from './routes/Shell'
import fileUpload from 'express-fileupload'
import cors from 'cors'

const app = Express()
app.use(Express.json())
app.use(cors())
app.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 50 * 2024 * 1024 },
  }),
)

app.use(ProductRoutes)
app.use(ShellRoutes)

app.listen(
  {
    port: 3333,
  },
  () => console.log('server running in http://localhost:3333'),
)
