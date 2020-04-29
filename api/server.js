const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const typeDefs = fs.readFileSync('./schema.graphql', { encoding: 'utf-8' });
const defaultProductInfo = {
  id: 0, name: '', category: 'NA', price: 0, image: '',
};
let db = null;
const { MongoClient } = require('mongodb');

const resolvers = {
  Query: {
    getProducts: () => {
      if (!db) {
        throw new Error('Empty database connection!!');
      }
      return db.collection('products').find({})
        .toArray()
        .then((products) => products)
        .catch((error) => {
          console.log(`Failed to retrieve products - ${error}`);
          return [];
        });
    },
    getProductInfo: (root, { id: productId }) => {
      if (!db) {
        throw new Error('Empty database connection!!');
      }
      const collection = db.collection('products');
      return collection.findOne({ id: productId }).then((product) => product);
    },
  },
  Mutation: {
    addProduct: (root, args) => {
      if (!db) {
        throw new Error('Empty database connection!!');
      }
      const collection = db.collection('products');
      collection.countDocuments({}).then((count) => {
        const newProduct = { ...defaultProductInfo, ...args.product || {}, id: count + 1 };
        // eslint-disable-next-line no-unused-vars
        return collection.insertOne(newProduct).then(({ insertedId }) => {
          const { id } = newProduct;
          return collection.findOne({ id })
            .then((product) => product);
        });
      })
        .catch((error) => console.log(`Product insertion failed: ${error}`));
    },
    updateProduct: (root, args) => {
      if (!db) {
        throw new Error('Empty database connection!!');
      }
      const collection = db.collection('products');
      const newProduct = { ...defaultProductInfo, ...args.product || {} };
      const { id } = newProduct;
      return collection.update({ id: { $eq: id } }, newProduct)
        // eslint-disable-next-line no-unused-vars
        .then(({ insertedId }) => collection.findOne({ id })
          .then((product) => product))
        .catch((error) => console.log(`Product ${id} - update failed: ${error}`));
    },
    removeProduct: (root, args) => {
      if (!db) {
        throw new Error('Empty database connection!!');
      }
      const collection = db.collection('products');
      const { id = 0 } = args;
      if (!id) {
        throw new Error(`Invalid product id - ${args.id} requested to be deleted !!`);
      }
      return collection.deleteOne({ id: { $eq: id } })
        .then(() => true)
        .catch((error) => console.log(`Product ${id} - delete failed: ${error}`));
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

app.use(cors());

server.applyMiddleware({ app });

const port = process.env.API_SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Server started listening on port ${port}`);
  const url = process.env.DB_URL || 'mongodb://localhost/products';
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect().then(() => {
    db = client.db();
  })
    .catch((error) => console.log(error));
});
