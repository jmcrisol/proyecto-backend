import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const cartsColletion = 'carts';


const cartsSchema = new Schema({
    products:{
        type: Array,
        default:[{
            type: Schema.Types.ObjectId,
            ref: 'products',
        }]
    }
});


const cartsModel = model(cartsColletion, cartsSchema);

export default cartsModel;