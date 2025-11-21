import FoodCategory from "../../../../Models/restuarentActivitiesModels/foodCategoryModel.js";
import RestaurantOwnerModel from "../../../../Models/restuarentsModel.js";
import FoodSubCategory from "../../../../Models/restuarentActivitiesModels/foodSubCategoryModel.js"

// import cloudinary from 'cloudinary';
// import fs from 'fs-extra';

import { uploadToCloudinary } from "../../../../config/cloudinaryUpload.js";


const addSubFoodCategory = async (req, res) => {
  try {
    const mobile = req.user.mobile;
     console.log(req.body);
    if (!mobile || !req.body) {
      return res.status(400).json({ error: "Restaurant is not authenticated" });
    }

    const owner = await RestaurantOwnerModel.findOne({ mobile }).lean();
    if (!owner) return res.status(404).json({ error: "Restaurant owner not found" });

    const foodCategory = await FoodCategory.findById(req.body.food_id).lean();
    if (!foodCategory) return res.status(404).json({ error: "Food Category not found" });

    let shopImg = "";  
     // Upload image using Cloudinary Stream
    if (req.file) {
      if (req.file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ message: "Image max size is 10MB" });
      }

      // Upload from memory buffer
      shopImg = await uploadToCloudinary(req.file.buffer);
    }

    const updatedData = new FoodSubCategory({
        name: req.body.foodName || undefined,
        image: shopImg || req.body.sub_cate_img || undefined,
        price: req.body.price || undefined,
        foodType: req.body.category,
        Discount: req.body.discount || undefined,
        restaurant: owner._id,
        FoodCategory:foodCategory._id,
    });


    const savedSubCategory = await updatedData.save();
    return res.status(200).json({ message: "Category created successfully", savedSubCategory });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default addSubFoodCategory;
