
import { Router } from 'express';
import signUpController from '../Controllers/customer_auth/signup.js';
import loginController from '../Controllers/customer_auth/login.js';
import logoutController from '../Controllers/customer_auth/logout.js';
import verifyUser from '../Controllers/customer_auth/verifyUser.js';
import updateProfile from '../Controllers/customer_auth/update.js';
import getUser from '../Controllers/customer_auth/getUser.js';
import authMiddleware from '../Controllers/customer_auth/authMiddleware.js';

import multer from 'multer';
import cloudinary from 'cloudinary';
import fs from 'fs-extra';

import dotenv from 'dotenv';
dotenv.config(); 


const router = Router();

router.get('/customer-profile',authMiddleware, getUser);
router.get('/verify', verifyUser);
router.post('/signup', signUpController);
router.post('/login', loginController);
router.post('/logout', logoutController);


// // cloudinary config
// cloudinary.config({
//     cloud_name: 'dx0qmwrrz',
//     api_key: '849214223577591',
//     api_secret: '_sIKa0UtNClm2FkdLztVkykr6XU'
// });


// cloudinary config
cloudinary.config({
    cloud_name: `${process.env.CLOUD_NAME}`,
    api_key:  `${process.env.API_KEY}`,
    api_secret:  `${process.env.API_SECRET}`
});


// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload');  // Temp storage location
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);  // Unique filename based on timestamp
    }
});

const upload = multer({ storage });
router.put('/profile-update', authMiddleware, upload.single('profileImg'), updateProfile);


// // Protected route example
// router.get('/profile', authMiddleware, (req, res) => {
//   res.json({ message: 'Welcome to dashboard', user: req.user });
// });

export default router;