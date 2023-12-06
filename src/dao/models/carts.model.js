import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const cartsColletion = 'carts';


const cartsSchema = new Schema({
    products:{
        type: Array,
        default:[]
    }
});


const cartsModel = model(cartsColletion, cartsSchema);

export default cartsModel;