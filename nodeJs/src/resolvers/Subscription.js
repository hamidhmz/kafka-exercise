module.exports = {
  consume: {
    subscribe(
      parent,
      { topicName, consumerGroup },
      { pubsub, kafka, client },
      info
    ) {
      const Consumer = kafka.Consumer;
      const consumer = new Consumer(client, [{ topic: topicName }], {
        groupId: consumerGroup,
      });

      consumer.on('message', function (message) {
      console.log("message", message)
        pubsub.publish(consumerGroup, {
          // message can be any name
          consume:message.value,
        });
      });

      return pubsub.asyncIterator(consumerGroup); // message can be any name
    },
  },
};
