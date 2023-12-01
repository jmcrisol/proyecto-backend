import { Router } from 'express';
import { promises as fs } from 'fs';
import Products from '../dao/models/products.model.js';

const productsRouter = Router();

// Leer el archivo JSON
let products = [];

productsRouter.get("/", async (req, res) => {
  try {
    let productList = await Products.find();
    res.send({ result: "success", payload: productList });
  } catch (error) {
    console.log("Error fetching data from MongoDB:", error);
    res.status(500).send({ result: "error", error: error.message });
  }
});

// productsRouter.get("/", async (req, res) => {

//   try {
//     let product = await Products.find();
//     res.json(product);
//   } catch (error) {
//     console.log("Error fetching data from MongoDB:", error);
//     res.status(500).send({ result: "error", error: error.message });
//   }
// });


async function readProductsFile() {
  try {
    const data = await fs.readFile('./src/data/products.json', 'utf8');
    products = JSON.parse(data);
  } catch (err) {
    console.error('Error al leer el archivo JSON:', err);
  }
}

readProductsFile(); // Lee el archivo al inicio

// Ruta para listar todos los productos con límite
// productsRouter.get('/', (req, res) => {
//     const limit = parseInt(req.query.limit, 10); // Parsea el parámetro 'limit' a un número entero
//     if (isNaN(limit) || limit <= 0) {
//       // Si 'limit' no es un número válido o es menor o igual a 0, muestra todos los productos
//       res.json(products);
//     } else {
//       // Muestra la cantidad limitada de productos
//       res.json(products.slice(0, limit));
//     }
//   });

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

  // Validar que todos los campos obligatorios estén presentes y tengan el tipo de dato correcto
  if (
    !newProduct.title ||
    !newProduct.description ||
    !newProduct.code ||
    typeof newProduct.price !== 'number' ||
    typeof newProduct.status !== 'boolean' ||
    typeof newProduct.stock !== 'number' ||
    !newProduct.category ||
    !Array.isArray(newProduct.thumbnails)
  ) {
    res.status(400).send('Faltan campos obligatorios o los tipos de datos son incorrectos en la solicitud');
  } else {
    // Generar un nuevo ID
    newProduct.id = generateNewProductId();
    products.push(newProduct);
    saveProductsToFile();
    res.status(201).json(newProduct);
  }
});


// Ruta para actualizar un producto por ID
productsRouter.put('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid); // Convertir el ID de cadena a número
  const updatedProduct = req.body;
  const existingProductIndex = products.findIndex(p => p.id === productId);

  if (existingProductIndex !== -1) {
    const existingProduct = products[existingProductIndex];

    // Recorre las propiedades del objeto actualizado y actualiza solo las coincidencias
    for (const key in updatedProduct) {
      if (key in existingProduct) {
        existingProduct[key] = updatedProduct[key];
      }
    }

    // Asegúrate de que el ID no se actualice
    existingProduct.id = productId;

    saveProductsToFile();
    res.json(existingProduct);
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
    await fs.writeFile('./src/data/products.json', JSON.stringify(products, null, 2), 'utf8');
  } catch (err) {
    console.error('Error al guardar en el archivo JSON:', err);
  }
}

// Genera un nuevo ID
function generateNewProductId() {
  const maxId = Math.max(...products.map(p => p.id), 0);
  return maxId + 1;
}


export default productsRouter;


