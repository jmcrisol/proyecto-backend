// Importar el modelo de datos Cart
import Carts from "../dao/models/carts.model.js";

async function loadCarts() {
  try {
    // Utilizar Mongoose para obtener todos los carritos de la base de datos
    const carts = await Carts.find();

    // Retornar los carritos obtenidos
    return carts;
  } catch (err) {
    console.error('Error al cargar los carritos desde la base de datos', err);
    return [];
  }
}


export { loadCarts };