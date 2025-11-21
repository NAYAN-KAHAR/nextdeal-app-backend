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

FoodSubCategorySchema.index({ price: 1 });
FoodSubCategorySchema.index({ restaurant: 1 });
FoodSubCategorySchema.index({ FoodCategory: 1 });

const FoodSubCategory = mongoose.model("FoodSubCategory", FoodSubCategorySchema);
export default FoodSubCategory;
