import { Router } from 'express';
import fs from 'fs';

const cartsRouter = Router();

// Función para cargar carritos desde el sistema de archivos
function loadCarts() {
  try {
    const cartData = fs.readFileSync('./src/carrito.json', 'utf8');
    const carts = JSON.parse(cartData);
    return Array.isArray(carts) ? carts : []; // Asegurarse de que sea un array
  } catch (err) {
    console.error('Error al cargar los carritos desde el sistema de archivos', err);
    return [];
  }
}

// Función para guardar carritos en el sistema de archivos
function saveCarts(carts) {
  const cartData = JSON.stringify(carts, null, 2);
  fs.writeFileSync('./src/carrito.json', cartData, 'utf8');
}

// Función para generar un ID único para el carrito
function generateCartId() {
  lastCartId = getLastCartId() + 1; // Obtener el último ID y luego incrementarlo
  return lastCartId.toString();
}

// Función para obtener el último ID de carrito guardado en './carrito.json'
function getLastCartId() {
  try {
    const cartData = fs.readFileSync('./src/carrito.json', 'utf8');
    const carts = JSON.parse(cartData);

    // Obtener el último carrito y su ID
    if (Array.isArray(carts) && carts.length > 0) {
      const lastCart = carts[carts.length - 1];
      return parseInt(lastCart.id) || 0;
    }

    return 0; // Si no hay carritos en el archivo JSON
  } catch (err) {
    console.error('Error al obtener el último ID de carrito desde carrito.json', err);
    return 0; // En caso de error, se establece 0 como valor predeterminado
  }
}

// Ruta raíz POST / para crear un nuevo carrito y acumularlo con los existentes
cartsRouter.post('/', (req, res) => {
  // Cargar carritos existentes desde el sistema de archivos
  const existingCarts = loadCarts();

  const newCart = {
    id: generateCartId(),
    products: [],
  };

  // Asegurarse de que existingCarts sea un array
  if (Array.isArray(existingCarts)) {
    // Agregar el nuevo carrito a la lista de carritos existentes
    existingCarts.push(newCart);

    // Guardar la lista actualizada de carritos en el sistema de archivos
    saveCarts(existingCarts);
  } else {
    console.error('existingCarts no es un array');
  }

  res.status(201).json(existingCarts); // Devolver todos los carritos, incluido el nuevo
});

// Ruta GET /:cid para listar los productos en un carrito específico
cartsRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = loadCart(cartId);

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
  const quantity = 1;

  const cart = loadCart(cartId);

  if (cart) {
    const existingProduct = cart.products.find((product) => product.product === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    saveCart(cart);

    res.status(201).json(cart);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
})

// Variable para mantener el último ID de carrito asignado
let lastCartId = getLastCartId();

// Función para cargar un carrito específico desde los carritos existentes
function loadCart(cartId) {
  const existingCarts = loadCarts();
  const cart = existingCarts.find((c) => c.id === cartId);
  return cart;
}

export default cartsRouter;
