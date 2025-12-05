import FoodItemsModel from "../../Models/customerActivitiesModels/foodItem_Model.js";
import customersAuth from "../../Models/customerAuth.js";


const foodCartsItemsDelete = async (req, res) => {
    const mobile = req.user.mobile;
    try{
        if(!mobile){
            return res.status(401).json({status:401, error:'Customer is unauthorized'});
        };

        const customer = await customersAuth.findOne({ mobile }).lean();
        if(!customer){
            return res.status(404).json({status:404, error:'Customer is not found'});
        };

        await FoodItemsModel.deleteMany({userId:customer._id});
        res.status(200).json({status:200, message:'Delete all carts items successfully'});
    }catch(err){
        console.log(err);
        return res.status(500).json({ status: 500, error: "Server error" });
    }
}

export default foodCartsItemsDelete;