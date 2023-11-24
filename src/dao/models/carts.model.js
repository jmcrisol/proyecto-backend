import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const cartsColletion = 'Carts';


const cartsSchema = new Schema({
    id: Number,
    products:{
        type:Array,
        default:[]
    }
});


const Carts = model(cartsColletion, cartsSchema);

export default Carts;