import mongoose from "mongoose";

// Daywise Timing Schema
const DaywiseTimingSchema = new mongoose.Schema({
  open: { type: String, required: true },
  close: { type: String, required: true },
});

// Restaurant Info Schema
const RestaurantInfoSchema = new mongoose.Schema({
    restaurants_Owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantsOwner",
      required: true,
    },

    restaurantName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    whatsapp: { type: String, trim: true },


   // Daywise Timings
    daywiseTimings: {
      Monday: { type: DaywiseTimingSchema},
      Tuesday: { type: DaywiseTimingSchema},
      Wednesday: { type: DaywiseTimingSchema},
      Thursday: { type: DaywiseTimingSchema},
      Friday: { type: DaywiseTimingSchema},
      Saturday: { type: DaywiseTimingSchema},
      Sunday: { type: DaywiseTimingSchema},
    },
  },
  { timestamps: true }
);

const RestaurantInfoModel = mongoose.model("RestaurantInformation", RestaurantInfoSchema);
export default RestaurantInfoModel;
