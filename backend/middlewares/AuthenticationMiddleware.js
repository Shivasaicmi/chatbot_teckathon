import { validateToken } from "../jwtUtils/jwtUtils.js";

export function validateUser(req,res,next){
    const authHeader = req.header('authorization');
    let token = null;
    
    if(authHeader && authHeader.startsWith('Bearer')){
        token = authHeader.split(' ')[1];
    }
    console.log(token);
    if(!token){
        res.status(403).json({message:"invalid token"});
        return;
    }
    const userDetails = validateToken(token);
    if(userDetails){
        req.userEmail = userDetails.userEmail
        req.userName = userDetails.userName;
        req.role = userDetails.role
        next();
    }
    else{
        res.status(401).json({message:"unauthorized"});
    }
}