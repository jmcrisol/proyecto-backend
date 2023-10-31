import express from 'express';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';



const app = express();
const port = 8080;


app.use(express.json());




//Mensaje ruta raíz del servidor
app.get('/', (req, res) => {
    res.send('1ra Pre-Entrega');
}); 



// Conectar los routers a las rutas principales
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


//Mensaje para cuelquier ruta erronea
app.use((req, res) => {
    res.status(404).send('Lo siento, no puedo encontrar lo que estás buscando.');
}); 

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto http://localhost:${port}`);
});


