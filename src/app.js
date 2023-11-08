import express from 'express';
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import viewRouter from "./routes/views.router.js";
import homeRouter from './routes/home.router.js';
import realtimeProductsRouter from './routes/realtimeproducts.router.js';
import realtimeproducts from './routes/realtimeproducts.router.js';

const app = express();
const port = 8080;

const httpServer = app.listen(port, ()=>{ console.log(`Servidor Express escuchando en el puerto ${port}`)});
app.use(express.json());
const io = new Server(httpServer)


app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewRouter);
app.use('/realtimeproducts', viewRouter);

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

});



// Conectar los routers a las rutas principales
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/home', homeRouter);
app.use('/realtimeproducts', realtimeproducts);

//Mensaje para cuelquier ruta erronea
app.use((req, res) => {
    res.status(404).send('Lo siento, no puedo encontrar lo que estás buscando.');
}); 

// app.listen(port, () => {
//   console.log(`Servidor Express escuchando en el puerto http://localhost:${port}`);
// });

