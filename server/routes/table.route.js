import express from 'express';
import { createTable, getAllTables, getTableBySlug } from '../controllers/table.controller.js';
import verifyToken from '../middlewares/verifyToken.js';
import checkRole from '../middlewares/checkRole.js';


const router= express.Router();


router.post('/tables',createTable)
router.get('/tables/:slug',getTableBySlug)
//end point ko access krne k liye user login(authenticate) rahega or uska role(authorization) => admin 
router.get('/tables',verifyToken,checkRole(['admin']),getAllTables)
export default router