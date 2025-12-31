import Coupan from './../models/coupan.js';
import User from '../models/user.js'
import Cart from '../models/cart.js'

export const getAllCoupans = async (req, res) => {
  try {
    const { cartTotal } = req.query;
    const userId = req.user.id;

    const user = await User.findById(userId);
    console.log('fetched from database', user);
    const cart = await Cart.findOne({ userId });
    let totalCartPrice;
    if (cart) {
      totalCartPrice = cart.totalCartPrice;
    }
    console.log(totalCartPrice);

    const allCoupans = await Coupan.find();
    console.log(allCoupans);

    const CoupansAfterCalculation = allCoupans.map((coupans) => {
      //calculate isAvailable flag
      const isCartPriceMeetsMinOrderAmount =
        totalCartPrice > coupans.minOrderAmount;
      const isCoupanIsValid =
        new Date() > coupans.validFrom && new Date() < coupans.validTo;
      const isUserFirstTime = user.totalOrders === 0;
      const isCoupanIsForFirstOrder = coupans.isFirstOrder;
      // console.log(coupans.code, isCartPriceMeetsMinOrderAmount);
      // console.log(isUserFirstTime);
      // console.log(isCoupanIsForFirstOrder);
      // console.log((coupans.isFirstOrder || isUserFirstTime));
      


      // const isAvailable =
      //   isCartPriceMeetsMinOrderAmount &&
      //   isCoupanIsValid &&
      //   (isCoupanIsForFirstOrder ? isUserFirstTime : true);

      const isAvailable =
        isCartPriceMeetsMinOrderAmount &&
        isCoupanIsValid &&
        (isCoupanIsForFirstOrder && isUserFirstTime);

      let discountAmount;
      if (coupans.discountType) {
        if (coupans.discountType === 'fixedAmount') {
          discountAmount = totalCartPrice - coupans.discountValue;
        }
        if (coupans.discountType === 'percentage') {
          discountAmount = (totalCartPrice * coupans.discountValue) / 100;
        }
        if (coupans.maxDiscount && discountAmount > coupans.maxDiscount) {
          discountAmount = coupans.maxDiscount;
        }
      }
      return {
        _id: coupans._id,

        finalAmount: totalCartPrice - discountAmount,
        code: coupans.code,
        discountType: coupans.discountType,
        description: coupans.description,
        discountAmount,
        isFirstOrder: coupans.isFirstOrder,
        minOrderAmount: coupans.minOrderAmount,
        validFrom: coupans.validFrom,
        validTo: coupans.validTo,
        isAvailable,
        isCartPriceMeetsMinOrderAmount,
        totalCartPrice,
      };
    });
    res.json({
      CoupansAfterCalculation,
    });
  } catch (error) { }
};

export const registerCoupan = async (req, res) => {
  try {
    const {
      code,
      discountType,
      maxDiscount,
      validFrom,
      validTo,
      usageLimit,
      minOrderAmount,
      discountValue,
      description
    } = req.body;

    if (!code || !discountType) {
      return res
        .status(400)
        .json({ message: 'Code and discountType are required' });
    }

    const existingCoupan = await Coupan.findOne({ code: code.toUpperCase() });
    if (existingCoupan) {
      return res.status(400).json({ message: 'Coupan code already exists' });
    }

    const coupanData = {
      code: code.toUpperCase(),
      discountType,
      maxDiscount: maxDiscount || null,
      validFrom: validFrom || new Date(),
      validTo: validTo || null,

      usageLimit: usageLimit || null,
      minOrderAmount: minOrderAmount || 0,
      discountValue: discountValue || 0,
      description: description || '',
      isActive: true,
      usedCount: 0,
    };

    const savedCoupan = await new Coupan(coupanData).save();

    res.status(201).json({
      message: 'Coupan created successfully',
      coupan: savedCoupan,
    });
  } catch (error) {
    console.error('Error registering coupan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


/* ================= APPLY COUPAN ================= */
export const applyCoupan = async (req, res) => {
  try {
    const { code, discountAmount } = req.body;
    const userId = req.user.id;

    if (!code) {
      return res.status(400).json({ message: 'Coupan code is required' });
    }

    /* ---------- Fetch Cart ---------- */
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.totalCartPrice <= 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalCartPrice = cart.totalCartPrice;

    /* ---------- Fetch Coupan (existence only) ---------- */
    const coupan = await Coupan.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupan) {
      return res.status(404).json({ message: 'Invalid coupan code' });
    }

    /* ---------- Safety Check ---------- */
    if (discountAmount < 0 || discountAmount > totalCartPrice) {
      return res.status(400).json({ message: 'Invalid discount amount' });
    }

    const finalAmount = totalCartPrice - discountAmount;

    /* ---------- Apply Coupan to Cart ---------- */
    cart.appliedCoupan = coupan.code;
    cart.discountAmount = discountAmount;
    cart.finalAmount = finalAmount;
    cart.minOrderAmountForCoupan = coupan.minOrderAmount;
    await cart.save();

    /* ---------- Response ---------- */
    res.status(200).json({
      success: true,
      message: 'Coupan applied successfully',
      code: coupan.code,
      totalCartPrice,
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    console.error('Apply Coupan Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
