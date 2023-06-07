import { Router, Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import { db } from '../lib/prisma'

cloudinary.config({
  cloud_name: 'dniub1le7',
  api_key: '225623592232615',
  api_secret: 'EF8FQwCb3wYIWSpffCkLE4vCRQU',
})

const ProductRoutes = Router()

ProductRoutes.post('/product', async (req: Request, res: Response) => {
  if (!req.files || !req.files.image) {
    res.status(400).json({ message: 'No image file provided' })
    return
  }

  const file = req.files.image as UploadedFile

  const { name, description } = req.body

  const result: UploadApiResponse = await cloudinary.uploader.upload(
    file.tempFilePath,
    {
      public_id: `${Date.now()}`,
      resource_type: 'auto',
      folder: 'images',
    },
  )

  const product = await db.product.create({
    data: {
      name,
      description,
      image: result.url,
    },
  })

  res.json(product)
})

ProductRoutes.get('/product', async (req, res) => {
  const products = await db.product.findMany({
    orderBy: {
      name: 'desc',
    },
  })

  return res.json(products)
})

ProductRoutes.delete('/product/:id', async (req, res) => {
  const id = req.params.id

  try {
    const result = await db.product.delete({
      where: {
        id,
      },
    })

    return res.json(result)
  } catch (error) {
    return res.status(500).json({ error: 'Id nonexistent' })
  }
})

// ProductRoutes.put('/product/:id', async (req, res) => {
//   if (!req.files || !req.files.image) {
//     res.status(400).json({ message: 'No image file provided' })
//     return
//   }

//   const id = req.params.id

//   const file = req.files.image as UploadedFile

//   const { name, description } = req.body

//   const result: UploadApiResponse = await cloudinary.uploader.upload(
//     file.tempFilePath,
//     {
//       public_id: `${Date.now()}`,
//       resource_type: 'auto',
//       folder: 'images',
//     },
//   )

//   try {
//     const product = await db.product.update({
//       where: {
//         id,
//       },
//       data: {
//         image: result.url,
//         name,
//         description,
//       },
//     })

//     return res.json(product)
//   } catch (error) {
//     return res.status(500).json({ error: 'Id nonexistent' })
//   }
// })

ProductRoutes.put('/product/:id', async (req, res) => {
  const id = req.params.id

  const { name, description } = req.body

  let imageUrl = null

  if (req.files && req.files.image) {
    const file = req.files.image as UploadedFile

    const result: UploadApiResponse = await cloudinary.uploader.upload(
      file.tempFilePath,
      {
        public_id: `${Date.now()}`,
        resource_type: 'auto',
        folder: 'images',
      },
    )

    imageUrl = result.url
  }

  try {
    const updateData = {
      ...(imageUrl && { image: imageUrl }),
      ...(name && { name }),
      ...(description && { description }),
    }

    const product = await db.product.update({
      where: {
        id,
      },
      data: updateData,
    })

    return res.json(product)
  } catch (error) {
    return res.status(500).json({ error: 'Id nonexistent' })
  }
})

export default ProductRoutes
