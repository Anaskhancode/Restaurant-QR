import express from "express";
import dbConnect from "./config/database.js";
import authroutes from './routes/auth.route.js'
import TableRoutes from './routes/table.route.js'
import sessionRoutes from './routes/session.route.js'
import cors from 'cors'
import verifyToken from "./middlewares/verifyToken.js";
import checkRole from "./middlewares/checkRole.js";
import menuRoutes from './routes/menu.route.js'
import cartRoutes from './routes/cart.route.js'
import dotenv from 'dotenv' ;

dotenv.config() ;

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
  res.send('menu fetched')
})

app.get("/", (req, res) => {
  res.send("Hello from Express using import!");
});

app.use('/api/v1/auth',authroutes);
app.use('/api/v1',TableRoutes)

app.use('/api/v1' , sessionRoutes);
app.use('/api/v1' , menuRoutes)
app.use('/api/v1/cart' , cartRoutes)

//here we placed the global error handleer => 
  app.use((err,req,res,next)=>{
    if(err){
      //TODO here you have to create a log file and call the logger.error method to save the information regarding every error you get in this project
      res.status(err.status || 500).json({
        messsage : err?.message || 'server error'
      })
    }
  })

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


