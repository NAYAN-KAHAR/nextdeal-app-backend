import FoodCategory from "../../../../Models/restuarentActivitiesModels/foodCategoryModel.js";
import RestaurantOwnerModel from "../../../../Models/restuarentsModel.js";
import FoodSubCategory from "../../../../Models/restuarentActivitiesModels/foodSubCategoryModel.js";

import { uploadToCloudinary } from "../../../../config/cloudinaryUpload.js";

const updateSubCategory = async (req, res) => {
  try {
    const mobile = req.user.mobile;
    const subCatId = req.params.id;

    if (!mobile || !subCatId) {
      return res.status(400).json({ error: "Restaurant is not authenticated" });
    }

    const owner = await RestaurantOwnerModel.findOne({ mobile });
    if (!owner) {
      return res.status(404).json({ error: "Restaurant owner not found" });
    }

    const foodCategory = await FoodCategory.findById(req.body.food_id);
    if (!foodCategory) {
      return res.status(404).json({ error: "Parent category not found" });
    }

    let shopImg;

    // Upload new image if provided
    if (req.file) {
      if (req.file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ message: "Image max size is 10MB" });
      }

      // Upload buffer to cloudinary
      shopImg = await uploadToCloudinary(req.file.buffer);
    }

    const updatedData = await FoodSubCategory.findByIdAndUpdate(
      subCatId,
      {
        name: req.body.foodName || undefined,
        image: shopImg || undefined, // only update if new image provided
        price: req.body.price || undefined,
        foodType: req.body.category || undefined,
        Discount: req.body.discount || undefined,
        restaurant: owner._id,
        FoodCategory: foodCategory._id,
      },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: "Sub-category not found" });
    }

    return res.status(200).json({
      message: "Sub-category updated successfully",
      updatedData,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default updateSubCategory;


// import FoodCategory from "../../../../Models/restuarentActivitiesModels/foodCategoryModel.js";
// import RestaurantOwnerModel from "../../../../Models/restuarentsModel.js";
// import FoodSubCategory from "../../../../Models/restuarentActivitiesModels/foodSubCategoryModel.js"; // ✅ correct import

// import cloudinary from 'cloudinary';
// import fs from 'fs-extra';

// const updateSubCategory = async (req, res) => {
//   try {
//     const mobile = req.user.mobile;
//     const subCatId = req.params.id;

//     if (!mobile || !subCatId) {
//       return res.status(400).json({ error: "Restaurant is not authenticated" });
//     }

//     const owner = await RestaurantOwnerModel.findOne({ mobile });
//     if (!owner) {
//       return res.status(404).json({ error: "Restaurant owner not found" });
//     }

//     const foodCategory = await FoodCategory.findById(req.body.food_id);
//     if (!foodCategory) {
//       return res.status(404).json({ error: "Parent category not found" });
//     }

//     let shopImg;
//     if (req.file) {
//       const filePath = req.file.path;
//       if (req.file.size > 10 * 1024 * 1024) {
//         fs.removeSync(filePath);
//         return res.status(400).json({ message: 'Large file is not allowed (max 10MB)' });
//       }

//       const response = await cloudinary.v2.uploader.upload(filePath, {
//         resource_type: 'auto'
//       });
//       fs.removeSync(filePath);
//       shopImg = response.secure_url;
//     }

//     const updatedData = await FoodSubCategory.findByIdAndUpdate(subCatId, {
//       name: req.body.foodName || undefined,
//       image: shopImg || undefined,
//       price: req.body.price || undefined,
//       foodType: req.body.category || undefined,
//       Discount: req.body.discount || undefined,
//       restaurant: owner._id,
//       FoodCategory: foodCategory._id
//     }, { new: true });

//     if (!updatedData) {
//       return res.status(404).json({ message: "Sub-category not found" });
//     }

//     return res.status(200).json({ message: "Sub-category updated successfully", updatedData });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Server Error", err });
//   }
// };

// export default updateSubCategory;
