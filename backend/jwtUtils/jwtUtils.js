import jwt from "jsonwebtoken";
export function generateToken(userEmail,userName){
    const data = {
        userEmail,userName
    };
    const secret_jwt_key = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(data,secret_jwt_key);
    if(!token){
        return null;
    }
    return token;
}

export function validateToken(token){
    const secret_jwt_key = process.env.JWT_SECRET_KEY;
    const validToken = jwt.verify(token,secret_jwt_key);
    if(validToken){
        return true;
    }
    return false;
}