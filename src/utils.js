import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const PRIVATE_KEY = "CoderKeyFeliz";


export const createHash = (password) =>
bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const generateToken =  ( user ) =>{
    const token =  jwt.sign({user},PRIVATE_KEY,{expiresIn:'1d'});
    return token;
}

export const authToken = (req,res,next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).send({status:"error",error:"Unauthorized"})
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(token,PRIVATE_KEY,(error,credentials)=>{
        console.log(error);
        if(error) return res.status(401).send({status:"error",error:"Unauthorized"})
        req.user = credentials.user;
        next();
    })
}


export default __dirname;