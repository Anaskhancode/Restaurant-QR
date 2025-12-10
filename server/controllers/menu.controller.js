import cloudinary from '../config/cloudnary.js';
import Menu from '../models/menu.js'
// console.log(cloudinary);
export const createMenu = async (req, res) => {
  // how can i access the image path here
  console.log(req.file);

  try {
    const filePath = req?.file?.path || null;
    console.log(filePath);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'menu',
    });
    console.log(result);
    const menuItem = await Menu.create({
      ...req.body,
      image: result.secure_url,
    });
    res.status(201).json({
      data: menuItem,
      message: 'New menu item addedd',
    });
  } catch (error) {
    console.log(error);
    
  }
};

//name ,description ,  price = {req.body};