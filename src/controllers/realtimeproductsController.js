import Products from "../dao/models/products.model.js";



// En el controlador, ahora acepta la instancia de Socket.IO como parámetro
export const realtimeProducts = async (req, res, io) => {
  try {
    // Aquí puedes agregar lógica para obtener productos en tiempo real
    const productList = await Products.find();

    // Convertir a objetos JSON simples
    const productsJSON = productList.map((product) => product.toJSON());

    // Renderizar la vista con la lista de productos
    res.render('layouts/realtimeproducts', { productList: productsJSON });
  } catch (error) {
    console.error('Error fetching real-time products:', error);
    res.status(500).send('Internal Server Error');
  }
};
