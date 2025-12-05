import RestaurantOwnerModel from "../../../../Models/restuarentsModel.js";
import AddOnModel from "../../../../Models/restuarentActivitiesModels/addOn_Model.js"

import { uploadToCloudinary } from "../../../../config/cloudinaryUpload.js";


const AddOnItemAdd = async (req, res) => {
  try {
    const mobile = req.user.mobile;
     console.log(req.body);
    if (!mobile || !req.body) {
      return res.status(400).json({ error: "Restaurant is not authenticated" });
    }

    const owner = await RestaurantOwnerModel.findOne({ mobile }).lean();
    if (!owner) return res.status(404).json({ error: "Restaurant owner not found" });

    let shopImg = "";  
     // Upload image using Cloudinary Stream
    if (req.file) {
      if (req.file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ message: "Image max size is 10MB" });
      }

      // Upload from memory buffer
      shopImg = await uploadToCloudinary(req.file.buffer);
    }

    const updatedData = new AddOnModel({
        name: req.body.foodName || undefined,
        image: shopImg || req.body.sub_cate_img || undefined,
        price: req.body.price || undefined,
        restaurant: owner._id,
       
    });


    const savedAddOns = await updatedData.save();
    return res.status(200).json({ message: "Add-ons created successfully", savedAddOns });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default AddOnItemAdd;
