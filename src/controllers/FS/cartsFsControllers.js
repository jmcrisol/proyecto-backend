
// Función para cargar carritos desde el sistema de archivos
function loadCarts() {
  try {
    const cartData = fs.readFileSync('./src/data/carrito.json', 'utf8');
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
    fs.writeFileSync('./src/data/carrito.json', cartData, 'utf8');
  }
  
  // Función para generar un ID único para el carrito
  function generateCartId() {
    lastCartId = getLastCartId() + 1; // Obtener el último ID y luego incrementarlo
    return lastCartId;
  }
  
  
  // Función para obtener el último ID de carrito guardado 
  function getLastCartId() {
    try {
      const cartData = fs.readFileSync('./src/data/carrito.json', 'utf8');
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
  
  Ruta raíz POST / para crear un nuevo carrito y agregarlo a los existentes
  cartsRouter.post('/', (req, res) => {
    // Cargar carritos existentes desde el JSON
    const existingCarts = loadCarts();
  
    const newCart = {
      id: generateCartId(),
      products: [],
    };
  
    // Asegurarse de que existingCarts sea un array
    if (Array.isArray(existingCarts)) {
      // Agregar el nuevo carrito a la lista de carritos 
      existingCarts.push(newCart);
  
      // Guardar la lista actualizada de carritos en el JSON
      saveCarts(existingCarts);
    } else {
      console.error('existingCarts no es un array');
    }
  
    res.status(201).json(existingCarts); // Devolver todos los carritos, incluido el nuevo
  });
  
  
  
  // Ruta POST /:cid/product/:pid para agregar un producto a un carrito
  cartsRouter.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid); 
  
    if (isNaN(productId)) {
      res.status(400).json({ message: 'El ID de producto no es un número válido' });
      return;
    }
  
    const quantity = 1;
  
    // Cargar los carritos existentes
    const existingCarts = loadCarts();
    const cart = existingCarts.find((c) => c.id === cartId);
  
    if (cart) {
      // Cargar los productos desde el JSON
      const productData = fs.readFileSync('./src/data/products.json', 'utf8');
      const products = JSON.parse(productData);
  
      // Verificar si el producto con el ID existe
      const productToAdd = products.find((product) => product.id === productId);
  
      if (productToAdd) {
        // Verificar si el producto ya existe en el carrito
        const existingProduct = cart.products.find((product) => product.product === productId);
  
        if (existingProduct) {
          // Si el producto ya existe, suma la cantidad
          existingProduct.quantity += quantity;
        } else {
          // Si el producto no existe en el carrito, agrega el producto al carrito
          cart.products.push({ product: productId, quantity });
        }
  
        // Guarda el carrito actualizado en la lista de carritos
        saveCarts(existingCarts);
  
        res.status(201).json(cart);
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  });
  
  
  // Variable para mantener el último ID de carrito asignado
  let lastCartId = getLastCartId();
  
  // Función para cargar un carrito específico desde los carritos existentes
  function loadCart(cartId) {
    const existingCarts = loadCarts();
    const cart = existingCarts.find((c) => c.id === cartId);
    return cart;
  }