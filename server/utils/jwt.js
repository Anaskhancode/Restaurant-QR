import jwt from 'jsonwebtoken'

export const generateAccessToken =(payload)=>{
    return jwt.sign(payload,'9XOHWYtF2uV9Ur858CIrT33MTAhPg0LFuAOixcbDgVPMmdYBQEKfjxADbRIR8tC',{expiresIn: "15m"})
}


export const generateRefreshToken =(payload)=>{
    return jwt.sign(payload,'9XOHWYtF2uV9Ur858CIrT33MTAhPg0LFuAOixcbDgVPMmdYBQEKfjxADbRIR8tC',{expiresIn: "7d"})
}