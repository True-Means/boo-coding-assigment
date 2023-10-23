'use strict';

const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const port =  process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set the view engine to ejs
app.set('view engine', 'ejs');

// routes
app.use('/', require('./routes/profile')());

// start server
// const server = app.listen(port);
// console.log('Express started. Listening on %s', port);
async function startInMemoryMongoDB() {
    const mongod = new MongoMemoryServer({
        autoStart: false, // Prevent automatic start of the in-memory MongoDB
        dbName: 'test'
    });
    // Start the in-memory MongoDB server.
    await mongod.start();
  
    // Get the connection URI for the in-memory MongoDB.
    const uri = mongod.getUri();
    console.log("uri", uri);
    // const uri = 'mongodb://127.0.0.1:27017/test';
  
    // Use the MongoDB URI for connecting to the in-memory database.
    // Replace this with your actual application's database connection logic.
    // console.log('MongoDB URI:', uri);
    mongoose.set("strictQuery", false);
    mongoose
        .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Mongodb-memory-server connected");
            app.listen(port, () => 
                console.log(`Server is listening on port ${port}`)
            );
        })
        .catch((err) => {
            console.log({err});
            process.exit(1);
        });
  
    // Ensure you stop the in-memory MongoDB server when done.
    await mongod.stop();
  }
  
  startInMemoryMongoDB();
