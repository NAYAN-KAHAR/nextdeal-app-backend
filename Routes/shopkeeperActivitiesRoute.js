
import { Router } from 'express';
import authMiddleware from '../Controllers/shopkeeper_auth/authMiddleware.js';


// free coupons routes files
import freeCouponLogic from '../Controllers/shopkeeper_activities/freeCoupons/freeCouponLogic.js';
import freeCouponCountLogic from '../Controllers/shopkeeper_activities/freeCoupons/freeCouponCountLogic.js';
import getAllFreeCoupons from  '../Controllers/shopkeeper_activities/freeCoupons/getAllFreeCoupons.js';
import DeleteFreeCoupon from  '../Controllers/shopkeeper_activities/freeCoupons/deleleFreeCoupon.js';
import UpdateFreeCoupon from '../Controllers/shopkeeper_activities/freeCoupons/updateFreeCoupon.js'



// recurring coupons routes files
import recurringCouponLogic from '../Controllers/shopkeeper_activities/recurringCoupons/RecurringCouponLogic.js';
import getAllRecurringCoupons from  '../Controllers/shopkeeper_activities/recurringCoupons/getAllRecurringCoupons.js';
import DeleteRecurringCoupon from  '../Controllers/shopkeeper_activities/recurringCoupons/deleleRecurringCoupon.js';
import UpdateRecurringCoupon from '../Controllers/shopkeeper_activities/recurringCoupons/updateRecurringCoupon.js'


// Next Offers files
import NextOfferCreate from  '../Controllers/shopkeeper_activities/nextOffers/postOffers.js';
import saleCouponsCreate from  '../Controllers/shopkeeper_activities/nextOffers/saleCouponsPost.js';
import getAllSalesCoupons from '../Controllers/shopkeeper_activities/nextOffers/saleCouponsGet.js';

import ListenRedeemCoupon from  '../Controllers/shopkeeper_activities/nextOffers/listenCustomerCoupon.js';
import fetchRedeemCouponById from '../Controllers/shopkeeper_activities/nextOffers/fetchRedeemCouponById.js'

const router = Router();

router.get('/shop-verify', authMiddleware, (req, res) => {
  res.status(200).json({ authenticated: true });
});

// free coupons routes
router.get('/shop-freecoupon-count',   authMiddleware, freeCouponCountLogic);
router.get('/shop-get-allfreecoupon',   authMiddleware, getAllFreeCoupons);
router.post('/shop-freecoupon-create', authMiddleware, freeCouponLogic);

router.put('/shop-free-coupons-update',authMiddleware, UpdateFreeCoupon)
router.delete('/shop-free-coupons-delete/:id',authMiddleware, DeleteFreeCoupon);



// recurring coupons routes
router.get('/shop-get-allrecurringcoupon',   authMiddleware, getAllRecurringCoupons);
router.post('/shop-recurringcoupon-create', authMiddleware, recurringCouponLogic);

router.put('/shop-recurringcoupon-update/:id', authMiddleware, UpdateRecurringCoupon)
router.delete('/shop-recurringcoupon-delete/:id', authMiddleware, DeleteRecurringCoupon);


// Next Offers Routes
router.post('/shop-next-offers-create', authMiddleware, NextOfferCreate);
router.post('/shop-sale-coupons-create', authMiddleware, saleCouponsCreate);
router.get('/shop-get-allsale-coupons', authMiddleware, getAllSalesCoupons);

router.get('/shop-listen-coupons', authMiddleware, ListenRedeemCoupon);
router.get('/shop-fetch-redeemcoupon-data/:id', authMiddleware, fetchRedeemCouponById);

export default router;