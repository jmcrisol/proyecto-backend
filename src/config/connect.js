import mongoose from "mongoose";

async function connectToDatabase() {


    try {
      await mongoose.connect('mongodb+srv://admin:admin@ecommerce.i3p9ffy.mongodb.net/?retryWrites=true&w=majority');
      console.log('Conexión exitosa a la base de datos');


    } catch (error) {
      console.error('Error de conexión a la base de datos:', error);
      process.exit(1);
    }
    
  }
  

export default connectToDatabase;
