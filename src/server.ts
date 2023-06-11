import Express from 'express'
import ProductRoutes from './routes/Product'
import ShelfRoutes from './routes/Shelf'
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
app.use(ShelfRoutes)

app.listen(
  {
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  },
  () => console.log('server running in http://localhost:3333'),
)
