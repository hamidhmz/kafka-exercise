async function produceMessage( producer, topicName, messages) {
  const payloads = [{ topic: topicName, messages }];
  producer.on('ready', () => {
    console.log(`i am ready`);
  });

  producer.on('error', (error) => {
    throw error
  });

  return new Promise((resolve, reject) => {
    producer.send(payloads, function (error, data) {
      if (error) reject(error);
      resolve(data);
    });
  });
}

module.exports = produceMessage;
