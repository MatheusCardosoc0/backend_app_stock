import { Shelf } from '@prisma/client'
import { Router } from 'express'
import { db } from '../lib/prisma'

const ShelfRoutes = Router()

ShelfRoutes.get('/shelf', async (req, res) => {
  const all_shelf = await db.shelf.findMany({
    include: {
      Product: true,
    },
  })

  return res.json(all_shelf)
})

ShelfRoutes.post('/shelf', async (req, res) => {
  const { Quantity, maturity, productId }: Omit<Shelf, 'id'> = req.body

  try {
    const shelf = await db.shelf.create({
      data: {
        maturity,
        Quantity,
        productId,
      },
    })

    return res.json(shelf)
  } catch (error) {
    res.status(400).json({ message: 'Error to create shelf' })
  }
})

ShelfRoutes.put('/shelf/:id', async (req, res) => {
  const id = req.params.id

  const { Quantity, maturity, productId }: Shelf = req.body

  try {
    const updateData = {
      ...(productId && { productId }),
      ...(maturity && { maturity }),
      ...(Quantity && { Quantity }),
    }

    const shelf = await db.shelf.update({
      where: {
        id,
      },
      data: updateData,
    })

    return res.json(shelf)
  } catch (error) {
    res.json(400).json({ message: 'Id nonexistent' })
  }
})

ShelfRoutes.delete('/shelf/:id', async (req, res) => {
  const id = req.params.id

  const deleteShelf = await db.shelf.delete({
    where: {
      id,
    },
  })

  return res.json(deleteShelf)
})

export default ShelfRoutes
