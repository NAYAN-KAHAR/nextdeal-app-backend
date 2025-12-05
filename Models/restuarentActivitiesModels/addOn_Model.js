import mongoose from "mongoose";

const AddOnModelSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantsOwner",
      required: true,
    },

    image: { type: String, required: true, trim: true },
    name: { type: String,required: true,trim: true },
    price: { type: Number,required: true, min: 0},

    },
    
  {
    timestamps: true,
  }
);

AddOnModelSchema.index({ name: "text" });
AddOnModelSchema.index({ restaurant: 1 });



const AddOnModel = mongoose.model("AddOnModels", AddOnModelSchema);
export default AddOnModel;
