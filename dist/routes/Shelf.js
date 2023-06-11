"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const ShelfRoutes = (0, express_1.Router)();
ShelfRoutes.get('/shelf', async (req, res) => {
    const all_shelf = await prisma_1.db.shelf.findMany({
        include: {
            Product: true,
        },
    });
    return res.json(all_shelf);
});
ShelfRoutes.post('/shelf', async (req, res) => {
    const { Quantity, maturity, productId } = req.body;
    try {
        const shelf = await prisma_1.db.shelf.create({
            data: {
                maturity,
                Quantity,
                productId,
            },
        });
        return res.json(shelf);
    }
    catch (error) {
        res.status(400).json({ message: 'Error to create shelf' });
    }
});
ShelfRoutes.put('/shelf/:id', async (req, res) => {
    const id = req.params.id;
    const { Quantity, maturity, productId } = req.body;
    try {
        const updateData = {
            ...(productId && { productId }),
            ...(maturity && { maturity }),
            ...(Quantity && { Quantity }),
        };
        const shelf = await prisma_1.db.shelf.update({
            where: {
                id,
            },
            data: updateData,
        });
        return res.json(shelf);
    }
    catch (error) {
        res.json(400).json({ message: 'Id nonexistent' });
    }
});
ShelfRoutes.delete('/shelf/:id', async (req, res) => {
    const id = req.params.id;
    const deleteShelf = await prisma_1.db.shelf.delete({
        where: {
            id,
        },
    });
    return res.json(deleteShelf);
});
exports.default = ShelfRoutes;
