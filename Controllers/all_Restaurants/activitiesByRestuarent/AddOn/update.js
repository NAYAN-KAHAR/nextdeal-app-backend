import RestaurantOwnerModel from "../../../../Models/restuarentsModel.js";
import AddOnModel from "../../../../Models/restuarentActivitiesModels/addOn_Model.js"

import { uploadToCloudinary } from "../../../../config/cloudinaryUpload.js";

const updateAddOnsItem = async (req, res) => {
  try {
    const mobile = req.user.mobile;
    const subCatId = req.params.id;

    if (!mobile || !subCatId) {
      return res.status(400).json({ error: "Restaurant is not authenticated" });
    }

    const owner = await RestaurantOwnerModel.findOne({ mobile }).lean();
    if (!owner) {
      return res.status(404).json({ error: "Restaurant owner not found" });
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

    const updatedData = await AddOnModel.findByIdAndUpdate(
      subCatId,
      {
        name: req.body.foodName || undefined,
        image: shopImg || undefined, // only update if new image provided
        price: req.body.price || undefined,
        restaurant: owner._id,
      },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: "Sub-category not found" });
    }

    return res.status(200).json({
      message: "Add-Ons updated successfully",
      updatedData,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error", err });
  }
};

export default updateAddOnsItem;
