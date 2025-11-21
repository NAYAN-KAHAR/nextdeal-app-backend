
import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';

const getShopkeeperForAccept = async (req, res) => {
  try {
 
    const { mobile } = req.params;
    console.log('mobile', mobile);

    if(!mobile){
        return res.status(404).json({ error: 'no mobile number found' });
    }
    const shopkeeper = await ShopkeeperAuth.findOne({ mobile });

    if (!shopkeeper) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Get user successfully', shopkeeper });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default getShopkeeperForAccept;
