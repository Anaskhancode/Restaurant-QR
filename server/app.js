import express from "express";
import dbConnect from "./config/database.js";
import authroutes from './routes/auth.route.js'
import cors from 'cors'
import verifyToken from "./middlewares/verifyToken.js";
import checkRole from "./middlewares/checkRole.js";

const app = express();
app.use(cors(
  {
    origin:['http://localhost:5173',]
  }
))


dbConnect();
app.use(express.json())

app.get('/menu',verifyToken,checkRole(['customer','admin']),(req,res)=>{
  // if (req.headers.authorization) {
  //   return res.send('you can access menu')
  // }else{
  //   return res.send('you are not authorized , please login first')
  // }
  
})

app.get("/", (req, res) => {
  res.send("Hello from Express using import!");
});

app.use('/api/v1/auth',authroutes);



const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


