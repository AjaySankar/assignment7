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
    getProductCount: () => {
      if (!db) {
        throw new Error('Empty database connection!!');
      }
      const collection = db.collection('products');
      return collection.countDocuments({}).then((count) => count);
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
    removeProduct: (root, { id: productId = 0 }) => {
      // Moves product to recycle bin
      if (!db) {
        throw new Error('Empty database connection!!');
      }
      const collection = db.collection('products');
      if (!productId) {
        throw new Error(`Invalid product id - ${productId} requested to be deleted !!`);
      }
      collection.findOne({ id: productId })
        .then((product) => {
          const recycledProduct = {};
          // eslint-disable-next-line no-return-assign
          Object.keys(defaultProductInfo).forEach((key) => recycledProduct[key] = product[key]);
          db.collection('recycle_products')
            .insertOne(recycledProduct)
            .then(() => collection.deleteOne({ id: { $eq: productId } }).then(() => true));
        })
        .catch((error) => console.log(`Product ${productId} - delete failed: ${error}`));
    },
    undoDelete: (root, { id: productId = 0 }) => {
      // Reverse operation of "removeProduct" resolver
      // Moves product from recycle bin to product list
      if (!db) {
        throw new Error('Empty database connection!!');
      }
      const collection = db.collection('recycle_products');
      if (!productId) {
        throw new Error(`Invalid product id - ${productId} requested to be deleted !!`);
      }
      collection.findOne({ id: productId })
        .then((product) => {
          const recycledProduct = {};
          // eslint-disable-next-line no-return-assign
          Object.keys(defaultProductInfo).forEach((key) => recycledProduct[key] = product[key]);
          db.collection('products')
            .insertOne(recycledProduct)
            .then(() => true);
        })
        .catch((error) => console.log(`Product ${productId} - undo-delete failed: ${error}`));
    },
    deleteForever: (root, { id: productId = 0 }) => {
      // Deletes object forever from recycle bin
      if (!db) {
        throw new Error('Empty database connection!!');
      }
      db.collection('recycle_products').deleteOne({ id: { $eq: productId } }).then(() => true);
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
