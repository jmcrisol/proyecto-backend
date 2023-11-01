import express from 'express';
import { promises as fs } from 'fs';

const productsRouter = express.Router();

// Leer el archivo JSON
let products = [];

async function readProductsFile() {
  try {
    const data = await fs.readFile('./products.json', 'utf8');
    products = JSON.parse(data);
  } catch (err) {
    console.error('Error al leer el archivo JSON:', err);
  }
}

readProductsFile(); // Lee el archivo al inicio

// Ruta para listar todos los productos con límite
productsRouter.get('/', (req, res) => {
    const limit = parseInt(req.query.limit, 10); // Parsea el parámetro 'limit' a un número entero
    if (isNaN(limit) || limit <= 0) {
      // Si 'limit' no es un número válido o es menor o igual a 0, muestra todos los productos
      res.json(products);
    } else {
      // Muestra la cantidad limitada de productos
      res.json(products.slice(0, limit));
    }
  });


// Ruta para traer un producto por ID
productsRouter.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  const product = products.find(p => p.id == productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// Ruta para agregar un nuevo producto
productsRouter.post('/', (req, res) => {
  const newProduct = req.body;
  // Validar que todos los campos obligatorios estén presentes
  if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
    res.status(400).send('Faltan campos obligatorios en la solicitud');
  } else {
    // Generar un nuevo ID (esto depende de cómo estás generando los IDs)
    newProduct.id = generateNewProductId();
    newProduct.status = true; // Status es true por defecto
    products.push(newProduct);
    saveProductsToFile();
    res.status(201).json(newProduct);
  }
});

// Ruta para actualizar un producto por ID
productsRouter.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  const existingProductIndex = products.findIndex(p => p.id == productId);
  if (existingProductIndex !== -1) {
    // No actualizar el ID
    updatedProduct.id = productId;
    products[existingProductIndex] = updatedProduct;
    saveProductsToFile();
    res.json(updatedProduct);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// Ruta para eliminar un producto por ID
productsRouter.delete('/:pid', (req, res) => {
  const productId = req.params.pid;
  const productIndex = products.findIndex(p => p.id == productId);
  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    saveProductsToFile();
    res.send('Producto eliminado');
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// Función para guardar los productos en el archivo
async function saveProductsToFile() {
  try {
    await fs.writeFile('./products.json', JSON.stringify(products, null, 2), 'utf8');
  } catch (err) {
    console.error('Error al guardar en el archivo JSON:', err);
  }
}

// Genera un nuevo ID (esto es un ejemplo, puedes ajustarlo según tu necesidad)
function generateNewProductId() {
  const maxId = Math.max(...products.map(p => p.id), 0);
  return maxId + 1;
}

export default productsRouter;
