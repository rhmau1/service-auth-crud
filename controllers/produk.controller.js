const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { successResponseWithData, errorResponse } = require('../utils/response');
const { publishCreateProductMessage, publishUpdateProductMessage } = require('../utils/rabbit');

const getAllProduk = async (req, res) => {
  try {
    const data = await prisma.produk.findMany({
      where: {
        deleted_at: null,
      },
    });
    console.log(data);
    return res.status(200).send(successResponseWithData(200, 'Success', data));
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse(500, 'Internal Server Error', error));
  }
};

const createProduk = async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const error = [];

    // console.log(req.body);
    if (!name) {
      error.push({ error: ['name is required'] });
    }
    if (!price) {
      error.push({ error: ['price is required'] });
    }
    if (!stock) {
      error.push({ error: ['stock is required'] });
    }
    if (isNaN(price)) {
      error.push({ error: ['price invalid. price must be a number'] });
    }
    if (isNaN(stock)) {
      error.push({ error: ['stock invalid. stock must be a number'] });
    }
    if (error.length > 0) {
      return res.status(400).send(errorResponse(400, 'Bad Request', error));
    }

    const data = await publishCreateProductMessage({
      name: name,
      price: parseInt(price),
      stock: parseInt(stock),
    });
    return res.status(201).send(successResponseWithData(201, 'Success add to queue', data));
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse(500, 'Internal Server Error', error));
  }
};

const updateProduk = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, stock } = req.body;
    const error = [];

    const checkProduk = await prisma.produk.findUnique({
      where: {
        produk_id: id,
        AND: {
          deleted_at: null,
        },
      },
    });
    if (!checkProduk) {
      return res.status(404).send(errorResponse(404, 'Produk not found'));
    }

    if (!name) {
      error.push({ error: ['name is required'] });
    }
    if (!price) {
      error.push({ error: ['price is required'] });
    }
    if (!stock) {
      error.push({ error: ['stock is required'] });
    }
    if (isNaN(price)) {
      error.push({ error: ['price invalid. price must be a number'] });
    }
    if (isNaN(stock)) {
      error.push({ error: ['stock invalid. stock must be a number'] });
    }
    if (error.length > 0) {
      return res.status(400).send(errorResponse(400, 'Bad Request', error));
    }

    const data = await publishUpdateProductMessage({
      produk_id: id,
      name: name,
      price: parseInt(price),
      stock: parseInt(stock),
    });

    return res.status(200).send(successResponseWithData(200, 'Success add to queue', data));
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse(500, 'Internal Server Error', error));
  }
};

const deleteProduk = async (req, res) => {
  try {
    const id = req.params.id;
    const checkProduk = await prisma.produk.findUnique({
      where: {
        produk_id: id,
        AND: {
          deleted_at: null,
        },
      },
    });
    if (!checkProduk) {
      return res.status(404).send(errorResponse(404, 'Produk not found'));
    }

    // await prisma.produk.delete({
    //   where: {
    //     produk_id: id,
    //   },
    // });

    await prisma.produk.update({
      data: {
        deleted_at: new Date(),
      },
      where: {
        produk_id: id,
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse(500, 'Internal Server Error', error));
  }
};

module.exports = { getAllProduk, createProduk, updateProduk, deleteProduk };
