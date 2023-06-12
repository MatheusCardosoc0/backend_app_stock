"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cloudinary_1 = require("cloudinary");
const prisma_1 = require("../lib/prisma");
cloudinary_1.v2.config({
    cloud_name: 'dniub1le7',
    api_key: '225623592232615',
    api_secret: 'EF8FQwCb3wYIWSpffCkLE4vCRQU',
});
const ProductRoutes = (0, express_1.Router)();
ProductRoutes.post('/product', async (req, res) => {
    if (!req.files || !req.files.image) {
        res.status(400).json({ message: 'No image file provided' });
        return;
    }
    const file = req.files.image;
    const { name, description } = req.body;
    const result = await cloudinary_1.v2.uploader.upload(file.tempFilePath, {
        public_id: `${Date.now()}`,
        resource_type: 'auto',
        folder: 'images',
    });
    const product = await prisma_1.db.product.create({
        data: {
            name,
            description,
            image: result.url,
        },
    });
    res.json(product);
});
ProductRoutes.get('/product', async (req, res) => {
    const products = await prisma_1.db.product.findMany({
        orderBy: {
            name: 'desc',
        },
        select: {
            name: true,
            image: true,
            id: true,
        },
    });
    return res.json(products);
});
ProductRoutes.get('/product/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const product = await prisma_1.db.product.findUnique({
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
        });
        return res.json(product);
    }
    catch (error) {
        res.status(400).json({ message: 'Id nonexistent' });
    }
});
ProductRoutes.delete('/product/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await prisma_1.db.product.delete({
            where: {
                id,
            },
        });
        return res.json(result);
    }
    catch (error) {
        return res.status(500).json({ error: 'Id nonexistent' });
    }
});
ProductRoutes.put('/product/:id', async (req, res) => {
    const id = req.params.id;
    const { name, description } = req.body;
    let imageUrl = null;
    if (req.files && req.files.image) {
        const file = req.files.image;
        const result = await cloudinary_1.v2.uploader.upload(file.tempFilePath, {
            public_id: `${Date.now()}`,
            resource_type: 'auto',
            folder: 'images',
        });
        imageUrl = result.url;
    }
    try {
        const updateData = {
            ...(imageUrl && { image: imageUrl }),
            ...(name && { name }),
            ...(description && { description }),
        };
        const product = await prisma_1.db.product.update({
            where: {
                id,
            },
            data: updateData,
        });
        return res.json(product);
    }
    catch (error) {
        return res.status(500).json({ error: 'Id nonexistent' });
    }
});
exports.default = ProductRoutes;
