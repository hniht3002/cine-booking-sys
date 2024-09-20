import { createHmac, sign } from "crypto"
import dotenv from "dotenv";
dotenv.config()

const base64url = (str:string) => {
    const base64 = btoa(str);

    return base64
        .replace(/\+/g, '-')  // Replace + with -
        .replace(/\//g, '_')  // Replace / with _
        .replace(/=+$/, '');  // Remove padding '='
}

const createSignature = (tokenData:string) => {
    if(!process.env.JWT_SECRET_KEY) {
        throw Error("Secret key not found!")
    }
    const hmac = createHmac("sha256", process.env.JWT_SECRET_KEY)
    const signature = hmac.update(tokenData).digest("base64url")
    return signature
}

export const createJWToken = (header:Object|null, payload:Object) => {
    

    // 1. khai báo header và payload
    if(!header) {
        const header = {
            alg: "HS256",
            typ: "JWT"
        }
    }

    // 2. Mã hóa base64 header và payload
    const encodeHeader = base64url(JSON.stringify(header))
    const encodePayload = base64url(JSON.stringify(payload))

    // 3. Tạo token data từ header và payload
    const tokenData = `${encodeHeader}.${encodePayload}`

    // 4. Tạo signature    
    const signature = createSignature(tokenData)

    return `${tokenData}.${signature}`

}

export const decodeJWToken = (token:string) => {
    const [encodedheader, encodedpayload, signature] = token.split(".")

    const header = JSON.parse(atob(encodedheader))
    const payload = JSON.parse(atob(encodedpayload))
    return [header, payload, signature]
}

export const verifyJWToken = (header:object, payload:object, signature:string) => {
    const encodeHeader = base64url(JSON.stringify(header))
    const encodePayload = base64url(JSON.stringify(payload))
    const newSignature = createSignature(`${encodeHeader}.${encodePayload}`)
    return newSignature === signature;
}