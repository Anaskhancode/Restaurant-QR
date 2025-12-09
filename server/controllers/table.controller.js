import crypto from 'crypto'
import QRCode from 'qrcode'
import Table from '../models/table.js';
import { successResponse } from '../utils/successResponse.js';
export const createTable = async (req, res) => {
    try {
        const { tableNumber, capacity } = req.body;

        //generate qr slug
        const qrSlug = crypto.randomBytes(6).toString('hex');
        console.log(qrSlug);

        // generate qr code url
        const qrCodeURL = `http://localhost:5173/welcome?qr=${qrSlug}`
        console.log(qrCodeURL);

        // emmbeding qrcodeurl with qr code
        QRCode.toDataURL(qrCodeURL, async (err, url) => {
            console.log(url);
            const qrImage = url;
            const table = new Table({
                tableNumber,
                capacity,
                qrImage,
                qrCodeURL,
                qrSlug,
            });

            await table.save();

            res.status(201).json({
                success: true,
                data: table,
            });
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}


export const getTableBySlug = async (req, res, next) => {
    try {
        //params //query params //req.body ;
        const { slug } = req.params;
        // console.log(typeof slug)
        // const filterObject = {qrSlug : slug , isActive : true} ;
        // console.log(filterObject) ;

        const table = await Table.findOne({ qrSlug: slug, isActive: true })
        console.log(table)
        if(!table){
           const error = new Error('No Table found with this slug');
           error.status = 404 ;
           throw error
        }
        res.status(200).json({
            success: true,
            data: table
        })
    } catch (error) {
        next(error)
    }
}



export const getAllTables = async(req,res, next)=>{
  try {
    const tables = await Table.find();
    if(tables.length <= 0){
      const error = new Error("No tables found")
      error.status = 404 ;
      throw error
    }
   successResponse(res,200,tables)
  } catch (error) {
    next(error)
  }
}