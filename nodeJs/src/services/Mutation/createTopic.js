async function createTopic(
  client,
  topicName,
  partitionsNumber,
  replicationFactor
) {
  const topicsToCreate = [
    {
      topic: topicName,
      partitions: partitionsNumber,
      replicationFactor,
    },
  ];

  return new Promise((resolve, reject) => {
    client.createTopics(topicsToCreate, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
}

module.exports = createTopic;
