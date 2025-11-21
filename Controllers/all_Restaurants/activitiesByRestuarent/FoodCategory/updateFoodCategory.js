import FoodCategory from "../../../../Models/restuarentActivitiesModels/foodCategoryModel.js";
import RestaurantOwnerModel from "../../../../Models/restuarentsModel.js";

import multer from 'multer';
import cloudinary from 'cloudinary';
import fs from 'fs-extra';

const updateCategory = async (req, res) => {
  try {
     const mobile = req.user.mobile;
     const cat_id = req.params.id;
     console.log(req.body, req.file, cat_id);

    if (!mobile  || !cat_id) {
      return res.status(400).json({ error: "Restuarent is not authenticated" });
    }

    const owner = await RestaurantOwnerModel.findOne({ mobile });
    if (!owner) {
        return res.status(404).json({ error: "Restaurant owner not found" });
    }

      let shopImg;
    
      if (req.file) {
        const filePath = req.file.path;
        console.log('filePath', filePath);
    
       // Check file size
        if (req.file.size > 10 * 1024 * 1024) {
          fs.removeSync(filePath); 
          return res.status(400).json({ message: 'Large file is not allowed (max 10MB)' });
        }
    
        // Upload to cloudinary
        const response = await cloudinary.v2.uploader.upload(filePath, {
          resource_type: 'auto'
        });
    
        fs.removeSync(filePath);
        shopImg = response.secure_url;
      }
    
    
   const updatedData = await FoodCategory.findByIdAndUpdate( cat_id,
        {
            name: req.body.cat_name || undefined,
            image: shopImg || undefined,
            restaurant: owner._id
        },
        { new: true }
        );

    if (!updatedData) {
      return res.status(404).json({ message: "Category not found" });
    }
   
    return res.status(200).json({message: "Category created successfully", updatedData});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default updateCategory;
