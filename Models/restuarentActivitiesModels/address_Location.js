import mongoose from "mongoose";

const RestaurantLocationSchema = new mongoose.Schema(
  {
    restaurants_Owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantsOwner",
      required: true,
    },

    name: { type: String, required: true, trim: true },
    formatted_address: { type: String, trim: true },
    place_id: { type: String, trim: true },
    plus_code: { type: String, trim: true },

    plot_number: { type: String, trim: true },
    building: { type: String, trim: true },
    floor: { type: String, trim: true },
    street: { type: String, trim: true },
    area: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    postal_code: { type: String, trim: true },

    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },

    // ✅ New field for geospatial queries
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { 
        type: [Number], 
        default: function() { 
          return [this.longitude, this.latitude]; // [lng, lat]
        } 
      },
    },

    types: [{ type: String, trim: true }],
    delivery_radius_km: { type: Number, default: 5 },
  },
  { timestamps: true }
);

// Create 2dsphere index for geospatial queries
RestaurantLocationSchema.index({ restaurants_Owner: 1 });
RestaurantLocationSchema.index({ location: '2dsphere' });

const RestaurantLocationModel = mongoose.model("RestaurantLocation", RestaurantLocationSchema);
export default RestaurantLocationModel;
