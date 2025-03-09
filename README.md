# Notes API

This is an API using node.js, express.js and MongoDB.

## The Database

The database is MongoDB, it was developed using a local instance but a remote one could be used for a production version. It uses Mongoose to make things easier to do when interacting with the DB.

The database has 2 collections just **users** and **notes** which respectively respresent the Authenticated users and the notes themselves.

## The Framework, Environment and Dependencies

This project is in Node (using JavaScript) with an Express server. It only covers the server part of the API, there's no separate frontend client UI included with this. It uses ES6 modules with import statements and a bit of babel when necessary.

The project does use a *.env* file for settings this should contain **MONGODB_URI** which has the URI to the MongoDB and **JWT_SECRET** which is a private secret key used in the Authentication.

For authentication it uses JWT tokens, it use the NPM module *jsonwebtoken* and it's a simple implementation where it just makes tokens and confirms them, there's no logout or revoking tokens and they should last 1 hour. It's very important that *.env* has its secret key value **JWT_SECRET** set.

Other dependencies used are *cors* which probably wasn't necessary since this is only an API but useful later on for CORS headers.

For rate limiting there's *express-rate-limit* for the rate limiting and request throttling requirement, it's set to 5 requests per second.

Finally for encrypting password in the DB there's *bcrypt* which was used to make hashes from the passwords. There's middleware with Mongoose where it encrypts new or modified passwords.

## How to run it

To run first use `npm install` to get all modules installed, then if running in dev with *nodemon* use `npm run dev`, if running in prod use `npm start` which should start the server. If running test cases use `npm run test`.
