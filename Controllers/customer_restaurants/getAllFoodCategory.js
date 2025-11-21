import FoodCategory from "../../Models/restuarentActivitiesModels/foodCategoryModel.js";
import FoodSubCategory from "../../Models/restuarentActivitiesModels/foodSubCategoryModel.js"
import customersAuth from "../../Models/customerAuth.js"
import redisClient from "../../config/redis.js";
import { json } from "express";


const getAllFoodCategory = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    if (!mobile ) {
      return res.status(400).json({ error: "customer is not authenticated" });
    }

    const customer = await customersAuth.findOne({ mobile }).lean();
    if (!customer) {
        return res.status(404).json({ error: "customer owner not found" });
    }
    // Get DATA from REDIS
    const catchedData = await redisClient.get('foods_data');
    if(catchedData){
      const parseData = JSON.parse(catchedData);
      return res.status(200).json({message: "Category and Subcategory comming from Redis",
         Categories:parseData.Categories, SubCategories:parseData.SubCategories });
    }


    // fetch data from mongodb 
     const Categories = await FoodCategory.find().lean();
     const SubCategories = await FoodSubCategory.find().lean();

     const dataToRedis = { Categories, SubCategories };

     // STORE DATA IN REDIS
     await redisClient.set('foods_data', JSON.stringify(dataToRedis), { EX:60*30 });

     return res.status(200).json({message: "Category and Subcategory getting successfully",
         Categories, SubCategories});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default getAllFoodCategory;

