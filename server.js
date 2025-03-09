/**
 * Main point of entry here if it's a running server
 * So stuff that needs to run as a server rather than for testing goes here.
 * Everything else that's important for all environments goes in app
 */
import 'dotenv/config';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import app from './app.js';
import connect from './data/connection.js';

const PORT = process.env.PORT || 4080;

//connect to DB, which should be the running server's DB
connect();

//setup and use rate limiter, which should only be for the running server and not testing
const limiter = rateLimit({
    max:5,
    window:1000
});
app.use(limiter);
app.use(cors()); //enable CORS

//Run the server
const server = app.listen(PORT, ()=>{console.log(`Running on localhost:${PORT}....`)});

export default server;