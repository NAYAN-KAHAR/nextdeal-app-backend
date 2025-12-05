
import { Router } from 'express';
import dotenv from 'dotenv';
dotenv.config(); 
import multer from 'multer';
import cloudinary from 'cloudinary';
import fs from 'fs-extra';

// cloudinary config
cloudinary.config({
    cloud_name: `${process.env.CLOUD_NAME}`,
    api_key:  `${process.env.API_KEY}`,
    api_secret:  `${process.env.API_SECRET}`
});



import loggedInOnlyMiddleware from '../Controllers/shopkeeper_auth/loggedInOnlyMiddleware.js';

import AddressLocationRestuarents from '../Controllers/all_Restaurants/multiStepForm/addLocationAdress.js';
import AddRestuarentsInfo from '../Controllers/all_Restaurants/multiStepForm/addRestuarentsInfo.js';
import AddRestuarentsDocument from '../Controllers/all_Restaurants/multiStepForm/addRestuarentsDocuments.js'
import getMiltiStepFormData from '../Controllers/all_Restaurants/multiStepForm/getMultiStepFormData.js';
import restuarentAcceptOrder from '../Controllers/all_Restaurants/activitiesByRestuarent/restuarentAcceptOrder.js'
import getIsAcceptingOrders from '../Controllers/all_Restaurants/activitiesByRestuarent/getIsAcceptsOrder.js'

import addFoodCategory from '../Controllers/all_Restaurants/activitiesByRestuarent/FoodCategory/addFoodCategory.js';
import getAllCategory from "../Controllers/all_Restaurants/activitiesByRestuarent/FoodCategory/getAllCategory.js"
import deleteCategory from '../Controllers/all_Restaurants/activitiesByRestuarent/FoodCategory/deteteFoodCategory.js'
import updateCategory from '../Controllers/all_Restaurants/activitiesByRestuarent/FoodCategory/updateFoodCategory.js'


import addSubFoodCategory from '../Controllers/all_Restaurants/activitiesByRestuarent/SubFoodCategory/addSubFoodCategory.js'
import getAllSubCategory from '../Controllers/all_Restaurants/activitiesByRestuarent/SubFoodCategory/getAllSubCategory.js'
import updateSubCategory from '../Controllers/all_Restaurants/activitiesByRestuarent/SubFoodCategory/updateSubFoodCategory.js'
import deleteSubCategory from '../Controllers/all_Restaurants/activitiesByRestuarent/SubFoodCategory/deteteSubFoodCategory.js'


import getAllCustomersOrders from '../Controllers/all_Restaurants/seeAllCustomersOrders/allCustomerOrders.js';


import AddOnItemAdd from '../Controllers/all_Restaurants/activitiesByRestuarent/AddOn/addItems.js';
import getAllAddOnsItems from '../Controllers/all_Restaurants/activitiesByRestuarent/AddOn/getItems.js';
import deleteAddOnItem from '../Controllers/all_Restaurants/activitiesByRestuarent/AddOn/deleteItems.js';
import updateAddOnsItem from '../Controllers/all_Restaurants/activitiesByRestuarent/AddOn/update.js';

const router = Router();


router.get('/verify-restuarents', loggedInOnlyMiddleware, (req,res) => {
      res.status(200).json({ authenticated: true});
});

router.post('/restuarents/add-location', loggedInOnlyMiddleware,AddressLocationRestuarents)
router.post('/restuarents/add-information', loggedInOnlyMiddleware, AddRestuarentsInfo);
router.post('/restuarents/add-document', loggedInOnlyMiddleware, AddRestuarentsDocument);
router.get('/restuarents/get-full-form-details', loggedInOnlyMiddleware, getMiltiStepFormData);
router.patch('/restuarents/accept-order', loggedInOnlyMiddleware, restuarentAcceptOrder);
router.get('/restuarents/gets-accept-order', loggedInOnlyMiddleware, getIsAcceptingOrders);



// Multer storage config
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './upload');  // Temp storage location
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + file.originalname); 
//     }
// });

// const upload = multer({ storage });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// food categories added routes
router.post('/restuarent-category-add',  upload.single('cat_img'),
     loggedInOnlyMiddleware, addFoodCategory);

router.get('/restuarents-get-category', loggedInOnlyMiddleware, getAllCategory);
router.delete('/restuarents-delete-category/:id', loggedInOnlyMiddleware, deleteCategory);
router.put('/restuarents-update-category/:id',  upload.single('cat_img'),
                                loggedInOnlyMiddleware, updateCategory);



// food sub categories added routes
router.post('/restuarent-sub-category-add',  upload.single('sub-cate_img'),
     loggedInOnlyMiddleware, addSubFoodCategory);

router.get('/restuarent-sub-category-get', loggedInOnlyMiddleware, getAllSubCategory);

router.put('/restuarents-update-subcategory/:id',  upload.single('sub-cate_img'),
                                loggedInOnlyMiddleware, updateSubCategory);

router.delete('/restuarents-delete-sub-category/:id', loggedInOnlyMiddleware, deleteSubCategory);

router.get('/restuarants-gets-all-orders', loggedInOnlyMiddleware, getAllCustomersOrders);



// add-ons logic routes
router.post('/restuarants-add-ons-items-add',  upload.single('add-ons_img'),
                                             loggedInOnlyMiddleware, AddOnItemAdd);

router.get('/restuarants-add-ons-items-gets',loggedInOnlyMiddleware, getAllAddOnsItems);
router.delete('/restuarents-delete-add-ons-items/:id', loggedInOnlyMiddleware, deleteAddOnItem);
router.put('/restuarents-update-add-ons-items/:id', upload.single('add-ons_img'),
                                loggedInOnlyMiddleware, updateAddOnsItem);



                                             
export default router;