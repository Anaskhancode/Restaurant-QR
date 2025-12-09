import Session from '../models/session.js';
import Table from '../models/table.js';
import crypto from 'crypto';
import { successResponse } from '../utils/successResponse.js';
export const session = async (req, res, next) => {
  try {
    const { deviceId, qrSlug } = req.body;

    //using this qrSlug i will find the tables where the user scans the qr
    const table = await Table.findOne({ qrSlug });
    console.log(table);

    const tableNumber = table.tableNumber;
    const sessionToken = crypto.randomBytes(32).toString('hex');
    console.log(sessionToken); //expiry time ?

  }catch(error){
    next(error)
  }
};