import ShopkeeperAuth from '../../Models/shopkeeperAuth.js';


const getShopkeeperShops = async (req, res) => {
  try {
    const { city } = req.params;
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }
    const shopkeepers = await ShopkeeperAuth.find({
        $or: [ { city: city.toLowerCase() }, { address: city.toLowerCase() }],
       business_category: { $ne: "restaurant" } }).lean();

    if (shopkeepers.length === 0) {
      return res.status(404).json({ error: 'No shops found for this city' });
    }

    return res.status(200).json({ message: 'Shops fetched successfully',shopkeepers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default getShopkeeperShops;
