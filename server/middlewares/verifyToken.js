//middleWares
import jwt from 'jsonwebtoken'



const verifyToken=(req,res,next)=>{
    try {
        // console.log(req.headers.authorization);
        if (req.headers.authorization) {
            const token= req.headers.authorization.split(' ')[1];
            console.log(token);
           const decoded= jwt.verify(token,'9XOHWYtF2uV9Ur858CIrT33MTAhPg0LFuAOixcbDgVPMmdYBQEKfjxADbRIR8tC')
           console.log(decoded);
           req.user=decoded
            
        }

        
    } catch (error) {
        
    }
}
export default verifyToken