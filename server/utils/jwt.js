import jwt from 'jsonwebtoken'

export const generateAccessToken =(payload)=>{
    return jwt.sign(payload,'9XOHWYtF2uV9Ur858CIrT33MTAhPg0LFuAOixcbDgVPMmdYBQEKfjxADbRIR8tC',{expiresIn: "1hr"})
}


export const generateRefreshToken =(payload)=>{
    return jwt.sign(payload,'9XOHWYtF2uV9Ur858CIrT33MTAhPg0LFuAOixcbDgVPMmdYBQEKfjxADbRIR8tC',{expiresIn: "7d"})
}