import mongoose from "mongoose";

const FoodSubCategorySchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantsOwner",
      required: true,
    },

    FoodCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodCategory",
      required: true,
    },

    image: { type: String, required: true, trim: true },
    name: { type: String,required: true,trim: true },
    price: { type: Number,required: true, min: 0},
    foodType: { type: String, required: true,  enum: ["Veg", "Non Veg"]},

    Discount: { type: Number, required: true, min: 0} },
  {
    timestamps: true,
  }
);

FoodSubCategorySchema.index({ name: "text" });


const FoodSubCategory = mongoose.model("FoodSubCategory", FoodSubCategorySchema);
export default FoodSubCategory;
