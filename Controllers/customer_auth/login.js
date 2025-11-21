
import customersAuth from '../../Models/customerAuth.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import dotenv from 'dotenv';
dotenv.config(); 


const customerSchema = Joi.object({
      mobile: Joi.string().pattern(/^[0-9]{10}$/).required()
           .messages({message:'Mobile number must be exactly 10 digits'}),
      password: Joi.string().min(6).required(),
});


const loginController = async (req, res) => {
    try {
     
      const {mobile, password } = await customerSchema.validateAsync(req.body);
      console.log(mobile, password);

      const userExist = await customersAuth.findOne({ mobile:mobile }).lean();
      if (!userExist) {
        return res.status(400).json({ error: 'User deos not exists' });
      }

      const checkPassword = await bcrypt.compare(password, userExist.password); 
      if(!checkPassword){ 
          return res.status(401).json({ error: 'Invalid password' });
      }
      
      const customerToken = jwt.sign({mobile:userExist.mobile},
                               `${process.env.CUSTOMER_SECRET}`, {expiresIn:'30d'});

      res.cookie('customerToken', customerToken, {
          httpOnly: true,       // prevent cross site scripting attack
          secure: true,
          sameSite: 'none',     // allow cross-site cookie
          maxAge: 30 * 24 * 60 * 60 * 1000, 
          });

      // console.log('customerToken : ', customerToken);
      return res.status(200).json({ message: 'Login successful', user: userExist });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };

export default loginController;


/*
import cluster from 'cluster';
import os from 'os';
import http from 'http';
import rateLimit from 'express-rate-limit';
import { createSocketServer } from './config/socket.js'; 
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart worker if it dies
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });

} else {
  const app = express();
  const server = http.createServer(app);

  // Initialize Socket.IO
  createSocketServer(server);

  // Middleware
  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet());
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://10.155.70.224:3001'],
    credentials: true
  }));

  const apiLimit = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 300,
    message: "Too many requests, please try again later."
  });
  app.use(apiLimit);

  // DB Connection
  mongoose.connection.on('error', (err) => console.log('Database connection failed', err));
  mongoose.connection.on('open', () => console.log('Database connected'));

  // Routes
  app.use('/api', customerAuthRoute);
  app.use('/api', customers_activities);
  app.use('/api', shopkeeperAuthRoute);
  app.use('/api', shopkeeperActivitiesRoute);
  app.use('/api', adminRoutes);
  app.use('/api', restuarents_activities);
  app.use('/api', customer_restaurentsRoutes);

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });
}


*/
