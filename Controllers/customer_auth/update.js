
import customersAuth from '../../Models/customerAuth.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import cloudinary from 'cloudinary';
import fs from 'fs-extra';


const updateProfile = async (req, res) => {
  try {
    const { name, email, address, city, state, location, password } = req.body;
    const mobile = req.user?.mobile;

    // console.log('decoded', mobile);
    // console.log('reqbody', req.body);

    let profileImg;

    if (req.file) {
      const filePath = req.file.path;
      console.log('filePath', filePath);

      // Check file size
      if (req.file.size > 10 * 1024 * 1024) {
        fs.removeSync(filePath); // cleanup local file
        return res.status(400).json({ message: 'Large file is not allowed (max 10MB)' });
      }

      // Upload to cloudinary
      const response = await cloudinary.v2.uploader.upload(filePath, {
        resource_type: 'auto'
      });

      fs.removeSync(filePath);
      profileImg = response.secure_url;
    }

    const updateFields = {};

     if (email) {
        const existingEmailUser = await customersAuth.findOne({ email}, { mobile:1 }).lean();
    
        if (existingEmailUser && existingEmailUser.mobile !== mobile) {
          return res.status(400).json({ message: 'Email already in use by another shopkeeper' });
        }
       updateFields.email = email;
      }
    

    if (name) updateFields.name = name;
    // if (email) updateFields.email = email;
    if (address) updateFields.address = address;
    if (profileImg) updateFields.profileImg = profileImg;
    if (location && location.coordinates) {
      updateFields.location = {
        type: "Point",
        coordinates: location.coordinates
      };
    }
    if (city) updateFields.city = city;
    if (state) updateFields.state = state;
    if (password){
      const hashPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashPassword;
    } 

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No fields provided to update' });
    }

    const updatedUser = await customersAuth.findOneAndUpdate({ mobile }, updateFields, { new: true });
    return res.status(200).json({ message: 'Profile updated', user: updatedUser, isUpdate:true });

  } catch (err) {
    console.error("Update Profile Error:", err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

export default updateProfile;