import express from 'express';

const chatRouter = express.Router();

chatRouter.get('/', (req, res)=>{
    res.render('layouts/chat',{});
});

export default chatRouter;