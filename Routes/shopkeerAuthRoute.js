
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

import createCashfreeOrder from '../Controllers/shopkeeper_auth/createCheckoutSession.js';
import loggedInOnlyMiddleware from '../Controllers/shopkeeper_auth/loggedInOnlyMiddleware.js';

import getShopkeeperForAccept from '../Controllers/shopkeeper_auth/getShopkeeperForAccept.js';
import RestaurantOwnerLogic from '../Controllers/shopkeeper_auth/RestaurantOwnerLogic.js'

import otpGenerate from '../Controllers/shopkeeper_auth/otpGenerate.js';
import otpVerification from '../Controllers/shopkeeper_auth/otpVerification.js'

import multer from 'multer';
import cloudinary from 'cloudinary';
import fs from 'fs-extra';

import dotenv from 'dotenv';
import { decode } from 'jsonwebtoken';
import RestaurantOwnerModel from '../Models/restuarentsModel.js';
dotenv.config(); 


const router = Router();

router.get('/shop-verify', authMiddleware, (req, res) => {
  const { shopkeeper, isRestaurant } = req;
  res.status(200).json({ authenticated: true, shopkeeper, isRestaurant});
});

router.get('/shop-verify-intro', loggedInOnlyMiddleware, (req, res) => {
  res.status(200).json({ shopkeeper:req.user, authenticated: true, userType: req.userType,});
});

router.get('/shopkeeper-profile-data/:mobile', getShopkeeperForAccept);

router.get('/shopkeeper-profile',authMiddleware, getShopkeeper);
router.get('/shopkeeper-subs', authMiddleware, getShopkeeperSubs);
router.post('/shop-signup', signUpController);
router.post('/shop-login', loginController);
router.post('/shop-logout', logoutController);

// router.post('/shop-subscribePlan', authMiddleware, SubscribePlan);
router.post('/shop-subscribePlan', loggedInOnlyMiddleware, SubscribePlan);

router.post('/shop-create-checkout-session', loggedInOnlyMiddleware, createCashfreeOrder);
router.post('/shop-created-as-restuarent', loggedInOnlyMiddleware, RestaurantOwnerLogic)


router.post('/mobile-generated-otp', otpGenerate);
router.post('/mobile-verification-otp', otpVerification);

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