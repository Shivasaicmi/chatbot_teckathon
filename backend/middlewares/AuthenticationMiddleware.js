import { validateToken } from "../jwtUtils/jwtUtils.js";

export function validateUser(req,res,next){
    const authHeader = req.header('authorization');
    let token = null;
    if(authHeader && authHeader.startsWith('Bearer')){
        token = authHeader.split(' ')[1];
    }
    if(!token){
        res.status(403).json({message:"invalid token"});
        return;
    }
    if(validateToken(token)){
        next();
    }
    else{
        res.status(401).json({message:"unauthorized"});
    }
}