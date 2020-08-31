module.exports = {
  consume: {
    subscribe(
      parent,
      { topicName, consumerGroup },
      { pubsub, kafka, client },
      info
    ) {
      // delivery semantics for consumers
      // at most once : offsets are committed as soon as the message batch is received. if the processing goes wrong, the message will be lost(it won't be read again)
      // at least once: offsets are committed after the message is processed. if the processing goes wrong , the message will be read again. this can result in duplicate processing of messages. make sure your processing is "idempotent" (this will use in most use cases)
      // exactly once: can be achieved for kafka
      /* ---------------------------------- xxxx ---------------------------------- */
      // 1.fetch.min.bytes(default 1): controls how much data you want to pull at least on each request
      // helps improving throughput and decreasing request number
      // at the const: ====> latency
      // 2.max.poll.records (default 500): how many messages would receive per poll request
      // increase this setting if your messages are very small and have a lot of available RAM
      // 3.max.partitions.fetch.bytes (default 1MB):
      // maximum data returned by the broker per partition
      // if you read from 100  partitions. you will need  a lot of memory
      // 4.fetch.max.bytes (default 50MB):
      // Maximum data returned for each fetch request( covers multiple partitions )
      /* ---------------------------------- xxxx ---------------------------------- */
      // don't change your config unless you have some problems

      // CONSUMER OFFSET COMMITS STRATEGIES:
      // 2 strategies we have :
      // (easy) enable.auto.commit = true & synchronous processing of batches
      // (medium) enable.auto.commit = false & manual commit of offsets
      
      const Consumer = kafka.Consumer;
      const consumer = new Consumer(client, [{ topic: topicName }], {
        groupId: consumerGroup,
      });

      consumer.on('message', function (message) {
        console.log('message', message);
        pubsub.publish(consumerGroup, {
          // message can be any name
          consume: message.value,
        });
      });

      return pubsub.asyncIterator(consumerGroup); // message can be any name
    },
  },
};
