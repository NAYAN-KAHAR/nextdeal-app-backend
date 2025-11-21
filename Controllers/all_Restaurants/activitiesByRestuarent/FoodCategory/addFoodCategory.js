import FoodCategory from "../../../../Models/restuarentActivitiesModels/foodCategoryModel.js";
import RestaurantOwnerModel from "../../../../Models/restuarentsModel.js";
import { uploadToCloudinary } from "../../../../config/cloudinaryUpload.js";

const addFoodCategory = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    if (!mobile || !req.body) {
      return res.status(400).json({ error: "Restaurant is not authenticated" });
    }

    const owner = await RestaurantOwnerModel.findOne({ mobile }).lean();
    if (!owner) {
      return res.status(404).json({ error: "Restaurant owner not found" });
    }

    let shopImg = null;

    // Upload image using Cloudinary Stream
    if (req.file) {
      if (req.file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ message: "Image max size is 10MB" });
      }

      // Upload from memory buffer
      shopImg = await uploadToCloudinary(req.file.buffer);
    }

    // Save category
    const category = await FoodCategory.create({
      name: req.body.cat_name,
      image: shopImg,
      restaurant: owner._id,
    });

    return res.status(200).json({message: "Category created successfully",updatedData: category});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default addFoodCategory;
