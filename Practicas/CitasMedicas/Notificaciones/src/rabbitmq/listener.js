// src/rabbitmq/listener.js

const { registrarNotificacion } = require("../services/notificacionService");
const logger = require("../utils/logger");
const amqp = require("amqplib");

async function startRabbitListener() {
  const queue = "notificaciones_queue";
  const connection = await amqp.connect("amqp://admin:admin@rabbitmq:5672");
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: false });
  console.log(`🟢 Escuchando en RabbitMQ (cola: ${queue})...`);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      logger.info(`🟢 Mensaje recibido: ${JSON.stringify(data)}`);
      await registrarNotificacion(data);
      logger.info(`🟢 Notificación registrada: ${JSON.stringify(data)}`);
      channel.ack(msg);
    }
  });
}

module.exports = { startRabbitListener };
