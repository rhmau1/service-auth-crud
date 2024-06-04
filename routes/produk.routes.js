const express = require('express');
const { getAllProduk, createProduk, updateProduk, deleteProduk } = require('../controllers/produk.controller');
const { verifyJwtAdmin } = require('../utils/jwt');
const produkRoutes = express.Router();

produkRoutes.get('/', getAllProduk);
produkRoutes.post('/', verifyJwtAdmin, createProduk);
produkRoutes.put('/:id', verifyJwtAdmin, updateProduk);
produkRoutes.delete('/:id', verifyJwtAdmin, deleteProduk);
module.exports = { produkRoutes };
