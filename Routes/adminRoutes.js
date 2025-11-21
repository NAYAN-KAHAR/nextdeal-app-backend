
import { Router } from 'express';
import dotenv from 'dotenv';
dotenv.config(); 

import getAllShopkeeperDetails from '../Controllers/Admin_Controller/getAllShopkeeperDetails.js';
import getAllCustomerDetails from '../Controllers/Admin_Controller/getAllCustomerDetails.js';
import getAllCouponDetails from '../Controllers/Admin_Controller/getAllCouponDetails.js';
import getAllDashboardDetails from '../Controllers/Admin_Controller/getAllDashboardDetails.js';

const router = Router();

router.get('/get-all-shopkeeper-details', getAllShopkeeperDetails);
router.get('/get-all-customers-details', getAllCustomerDetails);
router.get('/get-all-coupon-details', getAllCouponDetails);
router.get('/get-all-dashboard-details', getAllDashboardDetails);



export default router;