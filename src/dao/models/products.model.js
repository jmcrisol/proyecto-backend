import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema, model } = mongoose;
const productsColletion = 'products';


const productsSchema = new Schema({

    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    code: { type: String, required: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, required: true, default: true },
    category: { type: String, required: true },
    thumbnails:{
        type:Array,
        default:[]
    },
});

productsSchema.plugin(mongoosePaginate);

const Products = model(productsColletion, productsSchema);

export default Products;