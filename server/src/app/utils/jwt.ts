import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"


export const generateToken = (paylod: JwtPayload, secret: string, expiredIn: string) => {
    const token = jwt.sign(paylod, secret, {
        expiresIn: expiredIn
    } as SignOptions);


    return token;
}



export const verifyToken = (token: string, secret: string) => {
    const verifiedToken = jwt.verify(token, secret);

    return verifiedToken;
}