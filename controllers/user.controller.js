const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { successResponseWithData, errorResponse } = require('../utils/response');
const { matchPassword, hashPassword } = require('../utils/password');
const { signJwt } = require('../utils/jwt');
const { client } = require('../utils/redis');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const error = [];
    if (!email) {
      error.push({ error: ['email is required'] });
    }
    if (!password) {
      error.push({ error: ['password is required'] });
    }
    if (error.length > 0) {
      return res.status(400).send(errorResponse(400, 'Bad Request', error));
    }

    const data = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!data) {
      return res.status(404).send(errorResponse(404, 'email not found', error));
    }

    const passwordValid = await matchPassword(password, data.password);
    if (!passwordValid) {
      return res.status(400).send(errorResponse(400, 'password not valid', error));
    }

    const token = await signJwt(data.user_id, data.role);
    await client.set(`token:${data.user_id}`, token);
    // console.log(cache);

    return res.status(200).send(successResponseWithData(200, 'Success', token));
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse(500, 'Internal Server Error', error));
  }
};
const createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const error = [];

    if (!email) {
      error.push({ error: ['email is required'] });
    }
    if (!name) {
      error.push({ error: ['name is required'] });
    }
    if (!password) {
      error.push({ error: ['password is required'] });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        email: true,
      },
    });

    // console.log(existingUser);
    if (existingUser != null && existingUser.email == email) {
      error.push({ error: ['email already exists'] });
    }

    if (error.length > 0) {
      return res.status(400).send(errorResponse(400, 'Bad Request', error));
    }

    const hashpw = await hashPassword(password);
    const data = await prisma.user.create({
      data: {
        email: email,
        password: hashpw,
        name: name,
      },
      select: {
        email: true,
        name: true,
      },
    });

    return res.status(201).send(successResponseWithData(201, 'Created', data));
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse(500, 'Internal Server Error', error));
  }
};
module.exports = { createUser, loginUser };
