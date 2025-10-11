
import { Router } from 'express';
import signUpController from '../Controllers/shopkeeper_auth/signup.js';
import loginController from '../Controllers/shopkeeper_auth/login.js';

import logoutController from '../Controllers/shopkeeper_auth/logout.js';
import verifyShopkeeper from '../Controllers/shopkeeper_auth/verifyShopkeerper.js';

import updateShopkeeperProfile from '../Controllers/shopkeeper_auth/update.js';
import SubscribePlan from '../Controllers/shopkeeper_auth/shopkeeperSubscription.js';


import getShopkeeper from '../Controllers/shopkeeper_auth/getShopkeeper.js';
import authMiddleware from '../Controllers/shopkeeper_auth/authMiddleware.js';
import getShopkeeperSubs from '../Controllers/shopkeeper_auth/getSubs.js';


import multer from 'multer';
import cloudinary from 'cloudinary';
import fs from 'fs-extra';

import dotenv from 'dotenv';
dotenv.config(); 


const router = Router();

router.get('/shop-verify', authMiddleware, (req, res) => {
  res.status(200).json({ authenticated: true});
});

router.get('/shop-verify-intro', verifyShopkeeper);


router.get('/shopkeeper-profile',authMiddleware, getShopkeeper);
router.get('/shopkeeper-subs', authMiddleware, getShopkeeperSubs);
router.post('/shop-signup', signUpController);
router.post('/shop-login', loginController);
router.post('/shop-logout', logoutController);

router.post('/shop-subscribePlan', authMiddleware, SubscribePlan);

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
        cb(null, Date.now() + file.originalname); 
    }
});

const upload = multer({ storage });
router.put('/shop-profile-update', authMiddleware, upload.single('shopImg'), updateShopkeeperProfile);



export default router;