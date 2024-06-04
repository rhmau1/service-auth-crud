const amqp = require('amqplib');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const publishCreateProductMessage = async (data) => {
  try {
    const connection = await amqp.connect('amqp://fijri:fijri@');
    const channel = await connection.createChannel();
    // console.log('Connected to RabbitMQ successfully!');
    await channel.assertQueue('create_product_queue');
    await channel.sendToQueue('create_product_queue', Buffer.from(JSON.stringify(data)));
    console.log('Waiting for messages...');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  } finally {
    const connection = await amqp.connect('amqp://fijri:fijri@');
    await connection.close();
  }
};

async function startWorkerCreate() {
  const connection = await amqp.connect('amqp://fijri:fijri@');
  const channel = await connection.createChannel();
  await channel.assertQueue('create_product_queue');

  channel.consume('create_product_queue', async (message) => {
    try {
      const productData = JSON.parse(message.content.toString());
      // console.log('Received product data:', productData);
      const data = await prisma.produk.create({
        data: {
          name: productData.name,
          price: productData.price,
          stock: productData.stock,
        },
      });
      console.log(data);
      channel.ack(message);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
}

startWorkerCreate().catch((error) => {
  console.error('Worker service error:', error);
});

const publishUpdateProductMessage = async (data) => {
  try {
    const connection = await amqp.connect('amqp://fijri:fijri@');
    const channel = await connection.createChannel();
    // console.log('Connected to RabbitMQ successfully!');

    await channel.assertQueue('update_product_queue');
    await channel.sendToQueue('update_product_queue', Buffer.from(JSON.stringify(data)));
    console.log('Waiting for messages...');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  } finally {
    const connection = await amqp.connect('amqp://fijri:fijri@');
    await connection.close();
  }
};

async function startWorkerUpdate() {
  const connection = await amqp.connect('amqp://fijri:fijri@');
  const channel = await connection.createChannel();
  await channel.assertQueue('update_product_queue');

  channel.consume('update_product_queue', async (message) => {
    try {
      const productData = JSON.parse(message.content.toString());
      // console.log('Received product data:', productData);
      const data = await prisma.produk.update({
        data: {
          name: productData.name,
          price: productData.price,
          stock: productData.stock,
          updated_at: new Date(),
        },
        where: {
          produk_id: productData.produk_id,
        },
      });
      console.log(data);
      channel.ack(message);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
}

startWorkerUpdate().catch((error) => {
  console.error('Worker service error:', error);
});

module.exports = { publishCreateProductMessage, publishUpdateProductMessage };
