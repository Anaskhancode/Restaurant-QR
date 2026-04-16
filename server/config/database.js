import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(
    //   'mongodb+srv://riteshpatidar088:j0eG38RfUP1AROum@cluster0.b2vgi2d.mongodb.net/restaurent-qr?appName=Cluster0'
     'mongodb://Restaurant-qr-db:v4fhqhnd@ac-wbinv4r-shard-00-00.2gdisay.mongodb.net:27017,ac-wbinv4r-shard-00-01.2gdisay.mongodb.net:27017,ac-wbinv4r-shard-00-02.2gdisay.mongodb.net:27017/restaurent-qr-system?ssl=true&replicaSet=atlas-urd40b-shard-0&authSource=admin&appName=Cluster0'
    );
    console.log('db connected');
  } catch (error) {
    console.log(error);
  }

};

export default dbConnect;
