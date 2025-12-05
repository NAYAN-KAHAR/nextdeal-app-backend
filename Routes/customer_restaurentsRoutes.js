
import { Router } from 'express';
import dotenv from 'dotenv';
dotenv.config(); 

import authMiddleware from '../Controllers/customer_auth/authMiddleware.js';
import getAllShopkeeperDetails from '../Controllers/Admin_Controller/getAllShopkeeperDetails.js';


import getAllFoodCategory from '../Controllers/customer_restaurants/getAllFoodCategory.js';
import getVegNonVegRestuarents from '../Controllers/customer_restaurants/vegNonVegRestuarents.js';
import getSpecificRestuarent from '../Controllers/customer_restaurants/getSpecificRestuarent.js';
import getSpecificFoodsRestuarent from '../Controllers/customer_restaurants/getSpecificFoodsRestuarent.js'

import addFoodItemsViewCard from '../Controllers/customer_restaurants/foodItemViewCard.js';
import getFoodItemsViewCard from '../Controllers/customer_restaurants/getFoodItemViewCard.js';
import deleteFoodItemsViewCard from '../Controllers/customer_restaurants/deleteItemViewCard.js';
import getAllViewCardOrders from '../Controllers/customer_restaurants/getAllViewCardOrders.js';
import SearchFoodRestuarants from '../Controllers/customer_restaurants/searchFood_Restuarants.js';

import customerPlaceOrder from '../Controllers/customer_restaurants/customerPlaceOrder.js';
import getAllRestuarents from '../Controllers/all_Restaurants/activitiesByRestuarent/getAllRestuarents.js';

import orderDistanceMessurement from '../Controllers/customer_restaurants/orderDistanceMessure.js';
import foodCartsItemsDelete from '../Controllers/customer_restaurants/foodCartsItemsDelete.js';

import AllFood99 from '../Controllers/customer_restaurants/AllFood99.js';

import getAddOnsItems from '../Controllers/customer_restaurants/getAddOnsItems.js';

import checkoutGetFoodData from '../Controllers/customer_restaurants/chechoutGetFoodData.js';

const router = Router();


router.get('/get-all-shopkeeper-details', getAllShopkeeperDetails);
router.get('/get-all-nearest-restuarents', getAllRestuarents);


//  restuarents related routes
router.get('/get-all-food-categories', authMiddleware, getAllFoodCategory);
router.get('/get-veg-nonveg-restuarents/:selectVegType', authMiddleware, getVegNonVegRestuarents);
router.get('/get-specific-restuarent/:id', authMiddleware, getSpecificRestuarent);
router.get('/get-specific-restuarents-food/:id', authMiddleware, getSpecificFoodsRestuarent);

router.post('/add-food-item-view-cards', authMiddleware, addFoodItemsViewCard);
router.get('/get-food-item-view-cards', authMiddleware, getFoodItemsViewCard);
router.delete('/delete-food-item-view-cards', authMiddleware, deleteFoodItemsViewCard);



router.get('/get-all-view-card-orders', authMiddleware, getAllViewCardOrders);
router.get('/get-all-search-foods-restuarants/:name', authMiddleware, SearchFoodRestuarants)


router.post('/customer-place-order', authMiddleware, customerPlaceOrder)


router.post('/customer-restaurants-distance', authMiddleware, orderDistanceMessurement);
router.delete('/customer-food-items-delete', authMiddleware, foodCartsItemsDelete);


router.get('/customer-gets-all-addOn-items/:id', authMiddleware, getAddOnsItems);
router.get('/customer-gets-all-99-food-items', authMiddleware, AllFood99);

router.get('/get-checkout-data-customer', authMiddleware, checkoutGetFoodData);


export default router;

/*

*/