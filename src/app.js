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
import productsListRouter from './routes/productsList.router.js';
import cartsIdRouter from './routes/cartsId.router.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import indexRouter from './routes/views/index.js';
import loginRouter from './routes/views/login.js';
import profileRouter from './routes/views/profile.js';
import sessionsApiRouter from './routes/api/sessions.js';
import {authToken,generateToken} from './utils.js';



const app = express();
const port = 8080;
const httpServer = app.listen(port, ()=>{ console.log(`Servidor Express escuchando en el puerto http://localhost:${port}`)});
const io = new Server(httpServer)


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewRouter);

app.use(session({
    secret: 'CoderSecret', // Clave secreta para firmar las cookies de sesión
    resave: false, // Evitar que se guarde la sesión en cada solicitud
    saveUninitialized: true, // Guardar la sesión incluso si no se ha modificado
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://admin:admin@ecommerce.i3p9ffy.mongodb.net/login?retryWrites=true&w=majority",

        ttl: 2 * 60, // Tiempo de vida de la sesión en segundos (2 minutos en este caso)
    }),
}));


// Conectar los routers a las rutas principales
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/home', homeRouter);
app.use('/realtimeproducts', realtimeProducts);
app.use('/chat', chatRouter);
app.use('/products', productsListRouter);
app.use('/carts', cartsIdRouter);
app.use('/',viewRouter)
// app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/logout', sessionsApiRouter);
app.use('/api/sessions', sessionsApiRouter);


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

app.get('/register',(req,res)=>{
    res.render('register');
})

app.get('/login',(req,res)=>{
    res.render('login')
})


app.post('/api/register',(req,res)=>{
    const {name,email,password} = req.body;
    const exists = users.find(user=>user.email===email);
    if(exists) return res.status(400).send({status:"error",error:"User already exists"});
    const user = {
        name,
        email,
        password
    }
    users.push(user);
    const access_token = generateToken(user);
    res.send({status:"success",access_token});

})

app.post('/api/login',(req,res)=>{
    const {email,password} = req.body;
    const user = users.find(user=>user.email===email && user.password === password);
    console.log(user);
    if(!user) return res.status(400).send({status:"error",error:"Invalid credentials"});
    const access_token = generateToken(user);
    res.send({status:"success",access_token});
})

app.get('/api/current',authToken,(req,res)=>{
    res.send({status:"success",payload:req.user})
})


export default app;