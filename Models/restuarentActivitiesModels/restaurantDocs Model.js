import mongoose from "mongoose";

const RestaurantDocumentsSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantsOwner", 
      required: true,
    },

 
    outletType: { type: String, required: true },       // e.g., Dine-In, Cloud Kitchen
    restaurantType: { type: String, required: true },   

    pan: { type: String, required: true },
    gstin: { type: String, trim: true },

    bankIFSC: { type: String, required: true },
    bankAccountNumber: { type: String, required: true },
  },
  { timestamps: true }
);

RestaurantDocumentsSchema.index({restaurantType:1});

const RestaurantDocumentModel = mongoose.model("RestaurantDocuments", RestaurantDocumentsSchema);
export default RestaurantDocumentModel;
