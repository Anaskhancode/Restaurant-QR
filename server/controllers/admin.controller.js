import Order from '../models/order.js';
import Menu from '../models/menu.js';
import Coupan from '../models/coupan.js';
import Table from '../models/table.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [orderStats] = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$finalAmount' },
        },
      },
    ]);

    const totalMenuItems = await Menu.countDocuments();

    const totalActiveCoupans = await Coupan.countDocuments({
      isActive: true,
    });

    const totalTables = await Table.countDocuments({
      isActive: true,
    });

    res.json({
      totalOrders: orderStats?.totalOrders || 0,
      totalRevenue: orderStats?.totalRevenue || 0,
      totalMenuItems,
      totalActiveCoupans,
      totalTables,
    });
  } catch (error) {
    res.status(500).json({ message: 'Dashboard stats failed' });
  }
};
