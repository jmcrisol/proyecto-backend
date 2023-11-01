import { Router } from 'express';
import fs from 'fs';

const cartsRouter = Router();

// Ruta raíz POST / para crear un nuevo carrito
cartsRouter.post('/', (req, res) => {
  const newCart = {
    id: generateCartId(), // Implementa una función para generar un ID único
    products: [],
  };

  // Guarda el nuevo carrito en el sistema de archivos ( carrito.json)
  saveCart(newCart);

  res.status(201).json(newCart);
});

// Ruta GET /:cid para listar los productos en un carrito específico
cartsRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = loadCart(cartId); // Implementa una función para cargar el carrito desde el sistema de archivos

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

// Ruta POST /:cid/product/:pid para agregar un producto a un carrito
cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = 1; //se agrega un producto de uno en uno

  const cart = loadCart(cartId); // Cargar el carrito desde el sistema de archivos

  if (cart) {
    // Verifica si el producto ya existe en el carrito
    const existingProduct = cart.products.find((product) => product.product === productId);

    if (existingProduct) {
      // Si el producto ya existe, incrementa la cantidad
      existingProduct.quantity += quantity;
    } else {
      // Si el producto no existe, se agrega al carrito
      cart.products.push({ product: productId, quantity });
    }

    // Guarda el carrito actualizado en el sistema de archivos
    saveCart(cart);

    res.status(201).json(cart);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

// Variable para mantener el último ID de carrito asignado
let lastCartId = getLastCartId();

// Función para obtener el último ID de carrito guardado en './carrito.json'
function getLastCartId() {
  try {
    const cartData = fs.readFileSync('./carrito.json', 'utf8');
    const cart = JSON.parse(cartData);
    return parseInt(cart.id) || 0;
  } catch (err) {
    console.error('Error al obtener el último ID de carrito desde carrito.json', err);
    return 0; // Si ocurre un error, se establece 0 como valor predeterminado
  }
}

// Función para generar un ID único para el carrito
function generateCartId() {
  lastCartId++; // Incrementa el último ID
  return lastCartId.toString(); // Convierte el ID a cadena 
}


// Función para cargar un carrito desde el sistema de archivos
function loadCart(cartId) {
    try {
      const cartData = fs.readFileSync('./carrito.json', 'utf8'); // Lee el contenido del archivo
      const cart = JSON.parse(cartData); // Parsea el contenido del archivo JSON
  
      // Verifica si el carrito coincide con el cartId proporcionado
      if (cart.id === cartId) {
        return cart;
      } else {
        return null; // El carrito no coincide con el cartId
      }
    } catch (err) {
      console.error('Error al cargar el carrito desde el sistema de archivos', err);
      return null; // En caso de error, devuelve null
    }
  }

// Función para guardar un carrito en el sistema de archivos
function saveCart(cart) {
    const cartData = JSON.stringify(cart, null, 2); // Convierte el carrito a formato JSON con formato legible
   
    fs.appendFile('./carrito.json', cartData, (err) => {
      if (err) {
        console.error('Error al guardar el carrito en el sistema de archivos', err);
      } else {
        console.log('Carrito guardado exitosamente en el archivo carrito.json');
      }
    });
  }

export default cartsRouter;
