import express from 'express';
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import chatRouter from './routes/chat.router.js';
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import viewRouter from "./routes/views.router.js";
import homeRouter from './routes/home.router.js';
import realtimeProducts from './routes/realtimeproducts.router.js';
import messageModel from './dao/models/messages.model.js';


const app = express();
const port = 8080;
const httpServer = app.listen(port, ()=>{ console.log(`Servidor Express escuchando en el puerto http://localhost:${port}`)});
const io = new Server(httpServer)


app.use(express.json());
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewRouter);

// Conectar los routers a las rutas principales
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/home', homeRouter);
app.use('/realtimeproducts', realtimeProducts);
app.use('/chat', chatRouter);


//Mensaje para cuelquier ruta erronea
app.use((req, res) => {
    res.status(404).send('Lo siento, no puedo encontrar lo que estás buscando.');
}); 

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

   io.emit('realtimeProducts',)

//    socket.on('product', async (data) => {
//     try {
//         // Guardar el mensaje en MongoDB
//         const listProducts = new productsModel(data);

//         // Obtener el historial de mensajes actualizado
//         const products = await productsModel.find({});
        
//         // Emitir el historial de mensajes actualizado a todos los clientes
//         io.emit('realtimeProducts', products || []); // Enviar un array vacío si no hay mensajes
//     } catch (error) {
//         console.error(error);
//     }
// });

    socket.on('message', async (data) => {
        try {
            // Guardar el mensaje en MongoDB
            const newMessage = new messageModel(data);
            await newMessage.save();
    
            // Obtener el historial de mensajes actualizado
            const messages = await messageModel.find({});
            
            // Emitir el historial de mensajes actualizado a todos los clientes
            io.emit('messageLogs', messages || []); // Enviar un array vacío si no hay mensajes
        } catch (error) {
            console.error(error);
        }
    });

    socket.on("auth", (username) => {
        // Emitir el historial de mensajes al cliente que se autentica
        messageModel.find({})
            .then((messages) => {
                socket.emit("messageLogs", messages);
            })
            .catch((err) => {
                console.error(err);
            });
    
        // Emitir mensaje de usuario conectado a todos los clientes excepto al que se autentica
        socket.broadcast.emit("userConnected", username);
    });
});



