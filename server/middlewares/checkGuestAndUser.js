import jwt from 'jsonwebtoken';
import User from '../models/user.js'
const checkGuestOrUser = async (req , res , next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            console.log(token);
            const decoded = jwt.verify(
              token,
              '9XOHWYtF2uV9Ur858CIrT33MTAhPg0LFuAOixcbDgVPMmdYBQEKfjxADbRIR8tC'
            );
            console.log(decoded);
            const userData = await User.findById(decoded.id).select('-passwordHash')
            console.log(userData)
            req.user = userData
            next()
          } else {
            next()
          }
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}
export default checkGuestOrUser
//wo guest or login customer =>  upr wale middleware ka

// /orders => optional auth => controller   //loyalpoints


// choice => login =< loyalpoint 
// guest -> order => menu
//guest => main => register 
