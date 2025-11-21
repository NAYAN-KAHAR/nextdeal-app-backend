
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); 

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yar3p.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=MY-DATABASE`;

// const url = `mongodb+srv://admin123:nayan123@cluster0.yar3p.mongodb.net/Authentication?retryWrites=true&w=majority&appName=MY-DATABASE`;

mongoose.connect(url, { maxPoolSize:500 });


export default mongoose;
