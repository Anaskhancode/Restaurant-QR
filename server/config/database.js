import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(
    //   'mongodb+srv://riteshpatidar088:j0eG38RfUP1AROum@cluster0.b2vgi2d.mongodb.net/restaurent-qr?appName=Cluster0'
     'mongodb+srv://Restaurant-qr-db:v4fhqhnd@cluster0.2gdisay.mongodb.net/restaurent-qr-system?appName=Cluster0'
    );
    console.log('db connected');
  } catch (error) {
    console.log(error);
  }

};

export default dbConnect;
