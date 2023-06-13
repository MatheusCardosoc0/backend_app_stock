import { Router, Request, Response } from 'express'
import { db } from '../lib/prisma'

const ProductRoutes = Router()

ProductRoutes.post('/product', async (req: Request, res: Response) => {
  const { name, description, image } = req.body

  const product = await db.product.create({
    data: {
      name,
      description,
      image,
    },
  })

  res.json(product)
})

ProductRoutes.get('/product', async (req, res) => {
  const products = await db.product.findMany({
    orderBy: {
      name: 'desc',
    },
    select: {
      name: true,
      image: true,
      id: true,
    },
  })

  return res.json(products)
})

ProductRoutes.get('/product/:id', async (req, res) => {
  const id = req.params.id

  try {
    const product = await db.product.findUnique({
      where: {
        id,
      },
      include: {
        Shelf: {
          include: {
            Product: true,
          },
          orderBy: {
            id: 'asc',
          },
        },
      },
    })

    return res.json(product)
  } catch (error) {
    res.status(400).json({ message: 'Id nonexistent' })
  }
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
//   const id = req.params.id

//   const { name, description } = req.body

//   let imageUrl = null

//   if (req.files && req.files.image) {
//     const file = req.files.image as UploadedFile

//     const result: UploadApiResponse = await cloudinary.uploader.upload(
//       file.tempFilePath,
//       {
//         public_id: `${Date.now()}`,
//         resource_type: 'auto',
//         folder: 'images',
//       },
//     )

//     imageUrl = result.url
//   }

//   try {
//     const updateData = {
//       ...(imageUrl && { image: imageUrl }),
//       ...(name && { name }),
//       ...(description && { description }),
//     }

//     const product = await db.product.update({
//       where: {
//         id,
//       },
//       data: updateData,
//     })

//     return res.json(product)
//   } catch (error) {
//     return res.status(500).json({ error: 'Id nonexistent' })
//   }
// })

export default ProductRoutes
