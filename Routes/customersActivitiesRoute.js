
import { Router } from 'express';
import authMiddleware from '../Controllers/customer_auth/authMiddleware.js';


import getShopkeeperShops from  '../Controllers/customers_activities/getShopkeeperShops.js';
import getPerShopDetails from  '../Controllers/customers_activities/getPerShopDetails.js';
import getCategoriesShop from '../Controllers/customers_activities/getCategories_shop.js';
import getAllFreeCoupons from '../Controllers/customers_activities/getAllFreeCoupons.js';

// my coupons from for next purchase
import getMyCoupons from '../Controllers/shopkeeper_activities/nextOffers/getMyCoupons.js';
import getAllSaves from '../Controllers/customers_activities/getAllSave.js';

import CustomerRedeemCoupon from '../Controllers/customers_activities/pushCustomerCoupon.js';
import PushCustomefreeRedeemCoupon from '../Controllers/customers_activities/pushCustFreeCoupons.js'

const router = Router();

router.get('/shopkeepers-shops', authMiddleware, getShopkeeperShops);
router.get('/per-shopkeeper-shop/:mobile',  authMiddleware, getPerShopDetails);
router.get('/shopkeeper-category-shop/:category',  authMiddleware, getCategoriesShop);
router.get('/all-shopkeeper-freecoupons',  authMiddleware, getAllFreeCoupons);

// router.get('/shop-freecoupon-count',   authMiddleware, freeCouponCountLogic);


// My Coupons Routes
router.get('/next-offers-get-mycoupons', authMiddleware, getMyCoupons);
router.post('/customer-redeem-coupon', authMiddleware, CustomerRedeemCoupon);
router.post('/customer-redeem-free-coupon', authMiddleware, CustomerRedeemCoupon);



// My Save route
router.get('/my-all-save', authMiddleware, getAllSaves);
export default router;