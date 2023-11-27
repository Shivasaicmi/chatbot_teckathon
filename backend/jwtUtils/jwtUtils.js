import jwt from "jsonwebtoken";
export function generateToken(userEmail,userName,role){
    const data = {
        userEmail,userName,role
    };
    const secret_jwt_key = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(data,secret_jwt_key,{
        expiresIn:'24h'
    });
    if(!token){
        return null;
    }
    return token;
}

export function validateToken(token){
    const secret_jwt_key = process.env.JWT_SECRET_KEY;
    try{
        const userDetails = jwt.verify(token,secret_jwt_key);
        if(userDetails){
            return userDetails;
        }
        return null;
        
    }
    catch(error){
        return null;
    }
    
}