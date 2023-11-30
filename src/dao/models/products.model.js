import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const productsColletion = 'products';


const productsSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: String,
    stock: Number,
    status: Boolean,
    category: String,
    thumbnails: [String],
    // title: { type: String, required: true },
    // description: { type: String, required: true },
    // price: { type: Number, required: true },
    // thumbnail: { type: String, required: true },
    // code: { type: String, required: true },
    // stock: { type: Number, required: true },
    // id: { type: Number, required: true },
    // status: { type: Boolean, required: true, default: true },
    // category: { type: String, required: true },
    // thumbnails:{
    //     type:Array,
    //     default:[]
    // },
});


const Products = model(productsColletion, productsSchema);

export default Products;