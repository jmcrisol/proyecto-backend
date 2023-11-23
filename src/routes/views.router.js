import express from 'express';
import connectToDatabase from '../dao/connect.js';
const router = express.Router();

connectToDatabase();

router.get('/', (req, res)=>{
    res.render('index',{});
});




export default router;