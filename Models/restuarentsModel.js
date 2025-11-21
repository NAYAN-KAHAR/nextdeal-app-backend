import mongoose from "mongoose";

const RestaurantOwnerSchema = new mongoose.Schema({

  business_name: { type: String, required: true }, 
  mobile: { type: String, required: true, unique: true, index:true },
  address: { type: String, required: true },
  business_category: { type: String, default: 'Restaurant' }, 
  isAcceptingOrders: {
    type: Boolean,
    default: false // default to false (accepting orders)
  },

}, { timestamps: true });

const RestaurantOwnerModel = mongoose.model("RestaurantsOwner", RestaurantOwnerSchema);
export default RestaurantOwnerModel;




// import mongoose from "mongoose";

// const RestaurantOwnerSchema = new mongoose.Schema({
//   name: { type: String, required: true }, // Restaurant name
//   owner_name: { type: String },
//   mobile: { type: String, required: true, unique: true },
//   email: { type: String, unique: true, sparse: true },
  
//   address: { type: String, required: true },
//   city: { type: String },
//   pincode: { type: String },

//   cuisine_type: { type: [String], required: true }, // e.g., ['Indian', 'Chinese']
//   business_category: { type: String, default: 'Restaurant' }, // Fixed category

//   shopImg: String, // Storefront or logo image
//   menu_images: [String], // Optional: array of menu or food item images
  
//   opening_hours: {
//     open: { type: String },  // e.g., '10:00 AM'
//     close: { type: String }, // e.g., '10:00 PM'
//   },

//   delivery_available: { type: Boolean, default: true },
//   dine_in_available: { type: Boolean, default: true },
//   takeaway_available: { type: Boolean, default: true },

//   average_cost_for_two: { type: Number }, // Optional

//   min_offer: String,
//   max_offer: String,

// }, { timestamps: true });

// const RestaurantOwnerModel = mongoose.model("RestaurantsOwner", RestaurantOwnerSchema);
// export default RestaurantOwnerModel;
