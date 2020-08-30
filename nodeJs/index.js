const { ApolloServer, PubSub } = require('apollo-server');
const { importSchema } = require('graphql-import');
const resolvers = require('./src/resolvers');

const kafka = require('kafka-node');
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({kafkaHost: 'kafka:9092'});
const producer = new Producer(client);

const typeDefs = importSchema('./src/graphql/schema.graphql');

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { pubsub, producer, Producer, client , kafka },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
