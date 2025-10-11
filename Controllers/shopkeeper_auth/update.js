
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import cloudinary from 'cloudinary';
import fs from 'fs-extra';


const updateShopkeeperProfile = async (req, res) => {
  try {
    const {business_name,email,address,business_category,city,min_offer,max_offer} = req.body;
    const mobile = req.user?.mobile;

    console.log('decoded', mobile);
    console.log('reqbody', req.body);

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

   const updateFields = {};

    if (business_name) updateFields.business_name = business_name;
    if (business_category) updateFields.business_category = business_category;
    if (email) updateFields.email = email;
    if (address) updateFields.address = address;
    if (shopImg) updateFields.shopImg = shopImg;
    if (city) updateFields.city = city;
    if (min_offer) updateFields.min_offer = min_offer;
    if (max_offer) updateFields.max_offer = max_offer;



    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No fields provided to update' });
    }

    const updatedShopkeeper = await ShopkeeperAuth.findOneAndUpdate({ mobile }, updateFields, { new: true });
    return res.status(200).json({ message: 'Profile updated', shopkeeper: updatedShopkeeper });

  } catch (err) {
    console.error("Update Profile Error:", err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

export default updateShopkeeperProfile;


  