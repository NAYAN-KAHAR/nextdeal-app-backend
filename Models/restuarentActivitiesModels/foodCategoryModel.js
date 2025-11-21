import mongoose from "mongoose";


const FoodCategorySchema = new mongoose.Schema({
    restaurant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "RestaurantsOwner", 
          required: true,
        },
    
    name: { type: String, required: true, trim: true},
    image: { type: String, required: true } 

  },
  {
    timestamps: true, 
  }
);

const FoodCategory = mongoose.model("FoodCategory", FoodCategorySchema);
export default FoodCategory;
