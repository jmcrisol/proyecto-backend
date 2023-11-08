import express from 'express';
import { readFile } from 'fs/promises';

const homeRouter = express.Router();

homeRouter.get('/', async (req, res) => {
    try {
        // Lee los productos desde products.json de manera asíncrona
        const data = await readFile('./src/data/products.json', 'utf8');
        const products = JSON.parse(data);

        // Renderiza la vista home.handlebars y pasa los productos
        res.render('layouts/home', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cargar los productos.');
    }
});


export default homeRouter;