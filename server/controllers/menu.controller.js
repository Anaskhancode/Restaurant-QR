import cloudinary from '../config/cloudnary.js';
import Menu from '../models/menu.js';

/* ================= CREATE MENU ITEM ================= */
export const createMenu = async (req, res) => {
  try {
    // multer provides file info here
    const filePath = req?.file?.path;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required',
      });
    }

    // upload image to cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'menu',
    });

    const menuItem = await Menu.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      isAvailable: req.body.isAvailable,
      image: result.secure_url,
    });

    res.status(201).json({
      success: true,
      data: menuItem,
      message: 'New menu item added successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL MENU ITEMS (FILTER + SEARCH + PAGINATION) ================= */
export const getAllMenuItems = async (req, res, next) => {
  try {
    const {
      category = 'All',
      search = '',
      page = 1,
      limit = 9,
    } = req.query;

    const filter = {};

    // Category filter
    if (category !== 'All') {
      filter.category = category;
    }

    // Global search (name + description)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    // Fetch paginated items + total count in parallel
    const [items, total] = await Promise.all([
      Menu.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Menu.countDocuments(filter),
    ]);

    // Always return full category list
    const categories = await Menu.distinct('category');

    res.status(200).json({
      success: true,
      data: items,
      categories: ['All', ...categories],
      pagination: {
        totalItems: total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
