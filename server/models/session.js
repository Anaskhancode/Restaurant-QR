import mongoose from "mongoose";



const sessionSchema= new mongoose.Schema({

    sessionToken : {
        type : String ,
        default : null
        
    }, //backend se banega
    deviceId : {
        type : String ,
        default : null

    },//client bhejega
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User"

    },//baad main
    ip : {
        type  : String ,

    }, //req.ip
    userAgent : {
        type : String

    } , //req.headers.userAgent
    tableNumber : {
        type : Number

    }, //qrslug client => table ko find => table variable k ander data hoga => tableNumber milega
    qrCodeUrl : {
        type : String
    },
    convertedSession : {
        type : Boolean ,
        default : false
    },
    lastActivity : {
        type : Date ,
    }

});

const Session= mongoose.model('session',sessionSchema);

export default Session