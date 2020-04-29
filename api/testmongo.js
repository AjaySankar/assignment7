const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost/issuetracker';

const client = new MongoClient(url, { useNewUrlParser: true });

client.connect().then(() => {
    const db = client.db();
    const collection = db.collection('employees');
    // collection.find({})
    //   .toArray(function(err, docs) {
    //     console.log('Result of find:\n', docs);
    // });
    const ret = collection.count({})
    ret.then((result) => console.log(result))
})
.catch((error) => console.log(error))