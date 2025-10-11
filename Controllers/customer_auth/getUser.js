
import customersAuth from '../../Models/customerAuth.js';

const getUser = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const mobile = req.user?.mobile;

    const user = await customersAuth.findOne({ mobile });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Get user successfully', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default getUser;
