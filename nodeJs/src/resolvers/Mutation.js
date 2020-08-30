const { createTopic, produceMessage } = require('../services/Mutation');

module.exports = {
  async addTopic(parent, { topicName }, { client }) {
    // 1.min.insync.replicas=2 Ensures two brokers insync replicas at least have the data after an ack
    const result = await createTopic(client, topicName, 1, 1);
    console.log('addTopic -> result', result);

    return 1;
  },

  async produce(parent, { topicName, messages }, { producer }, info) {
    // 1.for produce for safe producer you can add acks=all
    // acks can be 0(does not care about any ack) , 1(dose not support replication just for bootstrap broker) or all (ensures data is properly replicated before ack is received)
    // 2.retries=MAX_INT ensures transient errors are retried indefinitely
    // 3.max.in.flight.requests.per.connection=1 make sure that we don't lose ordering guarantees if you don't mind just set it to five or leave it as is
    // 4.enable.idempotence=true this would ensure every duplicate commit wouldn't save
    // 5.compression compression.type // super helpful and important , it can be none(default) , gzip, lz4, snappy
    // here is some benchmark https://blog.cloudflare.com/squeezing-the-firehose/
    // compression advantages: 
    // a.smaller producer request size
    // b.faster transfer data over the network
    // c.better throughput
    // d.better disk utilization in kafka(stored messages on disk are smaller)
    // compression disadvantages: 
    // producers must commit some CPU cycles to compressions
    // Consumers also must commit some CPU cycles to decompression 
    // --OVERALL: snappy or lz4 optimal speed but gzip is going to have highest compression ratio
    // snappy is good for text base or json messages
    // snappy made by google
    // 6.linger.ms this means how much delay to make batch.size and after that delay or after batch.size would be full producer will send the messages as batch to kafka
    // linger.ms by default is 0
    // batch size by default is 16kb and its is okay if you change it to 32kb or 64kb but don't set it very hight number
    // consumer knows by default how to decompress  and developer dose not need to do any thing
    const result = await produceMessage(producer, topicName, messages);
    console.log('produce -> result', result);

    return true;
  },
};
