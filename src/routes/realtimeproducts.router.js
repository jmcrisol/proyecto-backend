import express from 'express';
import { readFile } from 'fs/promises';

const realtimeproducts = express.Router();

realtimeproducts.get('/', async (req, res) => {
    try {
        const data = await readFile('./src/data/products.json', 'utf8');
        const products = JSON.parse(data);

        res.render('layouts/realTimeProducts', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cargar los productos.');
    }
});


export default realtimeproducts;