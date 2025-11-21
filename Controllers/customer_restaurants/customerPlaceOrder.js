import OrderModel from '../../Models/restuarentActivitiesModels/orderPlaceModel.js';
import FoodItemsModel from "../../Models/customerActivitiesModels/foodItem_Model.js";
import FoodSubCategory from '../../Models/restuarentActivitiesModels/foodSubCategoryModel.js';


const customerPlaceOrder = async (req, res) => {
  const mobile = req.user?.mobile;
  console.log('mobile:', mobile);
  const { orderData, addressFormat } = req.body;

  try {
    if (!mobile) {
      return res.status(400).json({ error: "Customer is not authenticated" });
    }
    if (!orderData || orderData.length === 0) {
      return res.status(400).json({ error: "No items to order." });
    }

    let storedUserID;

    // Map through the orderData to compute total price per item and the overall pricing
    const items = await Promise.all(orderData.map(async (orderItem) => {
      const { FoodSubCategory: foodSubCategoryId, count, userId } = orderItem;
      storedUserID = userId;

      try {
        // Fetch the food category details
        const foodCategoryDetails = await FoodSubCategory.findById(foodSubCategoryId).lean();
        if (!foodCategoryDetails) {
          return { error: 'FoodSubCategory ID not found.' };
        }

        const { price, Discount, name, image } = foodCategoryDetails;

        // Calculate the discount and total price for this item
        const discountPrice = price - Discount;  // Adjust for discount
        const totalItemPrice = discountPrice * count;

        return {
          foodItemId: foodCategoryDetails._id,
          name,
          price,
          quantity: count,
          image,
          discount: Discount,
          totalItemPrice,
        };

      } catch (error) {
        return null;
      }
    }));

    // Filter out items with errors (if any)
    const validItems = items.filter(item => !item.null);

    if (validItems.length === 0) {
      return res.status(400).json({ error: 'No valid items in the order.' });
    }

    // Get the restaurant ID from the first valid food item
    const restaurantId = validItems.length > 0 ? 
        (await FoodSubCategory.findById(validItems[0].foodItemId)).restaurant 
        : null;

    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant not found for this order." });
    }

    // Calculate total price and other pricing details
    const subTotal = validItems.reduce((sum, item) => sum + item.totalItemPrice, 0);
    const deliveryFee = 30; 
    const discount = 0; 
    const total = subTotal + deliveryFee - discount;

    // Create the order object
    const newOrder = {
      customerId: storedUserID,
      restaurantId: restaurantId,
      items: validItems,
      deliveryAddress: {
        name: addressFormat.name,
        label: addressFormat.formatted_address,
        street: addressFormat.street,
        area: addressFormat.area,
        city: addressFormat.city,
        state: addressFormat.state,
        pincode: addressFormat.postal_code,
        coordinates: {
          lat: addressFormat.latitude,
          lng: addressFormat.longitude,
        },
      },
      paymentInfo: {
        method: "COD", // Cash on Delivery (or you can adjust based on user selection)
        status: "Pending", // Payment is pending at this point
        transactionId: null,
        amountPaid: total,
      },
      pricing: {
        subTotal,
        deliveryFee,
        discount,
        total,
      },
      deliveryStatus: "Order Placed", // Initial status when the order is placed
    };

    // Insert the order into the database
    const insertedOrders = await OrderModel.insertMany([newOrder]);

    await FoodItemsModel.deleteMany({ userId:storedUserID })
    return res.status(201).json({ message: "Order placed successfully!", insertedOrders });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong in placing the order." });
  }
};

export default customerPlaceOrder;
