import cartsModel from "../dao/models/carts.model.js";
import productsModel from "../dao/models/products.model.js";

export const loadCarts = async (req,res) => {
try {
    let carts = await cartsModel.find();
    res.send({ result: "success", payload: carts });
  } catch (error) {
    console.log("Error fetching data from MongoDB:", error);
    res.status(500).send({ result: "error", error: error.message });
  }
};

export const loadCartsId = async (req, res) => {
  try {
    const { cid } = req.params; // Obtener el parámetro cid de la URL
    let carts;

    if (cid) {
      // Si cid está presente, realizar búsqueda por ese id
      carts = await cartsModel.findById(cid);
    } else {
      // Si no hay cid, obtener todos los carritos
      carts = await cartsModel.find();
    }

    res.send({ result: "success", payload: carts });
  } catch (error) {
    console.log("Error fetching data from MongoDB:", error);
    res.status(500).send({ result: "error", error: error.message });
  }
};

export const newCart = async (req, res) => {
  try {
    // Crear un nuevo carrito vacío según el esquema
    const newCart = await cartsModel.create({ products: [] });

    res.send({ result: "success", payload: newCart });
  } catch (error) {
    console.log("Error creating new cart:", error);
    res.status(500).send({ result: "error", error: error.message });
  }
};



export const addProductById = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    // Validar que la cantidad sea un número positivo
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).send({ result: "error", error: "La cantidad debe ser un número positivo." });
    }

    // Verificar que el producto exista en la colección de productos
    const product = await productsModel.findById(pid);

    if (!product) {
      return res.status(404).send({ result: "error", error: "Producto no encontrado." });
    }

    // Encontrar el carrito por su ID y actualizar la cantidad del producto si ya está presente
    const updatedCart = await cartsModel.findOneAndUpdate(
      { _id: cid, "products.productId": product._id },
      { $inc: { "products.$.quantity": parseInt(quantity, 10) } },
      { new: true }
    );

    // Si el producto no está en el carrito, agregarlo con la cantidad proporcionada
    if (!updatedCart) {
      const newCart = await cartsModel.findByIdAndUpdate(
        cid,
        { $push: { products: { productId: product._id, quantity: parseInt(quantity, 10) } } },
        { new: true }
      );
      return res.send({ result: "success", payload: newCart });
    }

    res.send({ result: "success", payload: updatedCart });
  } catch (error) {
    console.log("Error adding product to cart:", error);
    res.status(500).send({ result: "error", error: error.message });
  }
};