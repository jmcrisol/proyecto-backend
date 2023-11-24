import express from 'express';
import connectToDatabase from '../config/connect.js';
const router = express.Router();

connectToDatabase();

router.get('/', (req, res)=>{
    res.render('index',{});
});




export default router;