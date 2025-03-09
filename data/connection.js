/**
 * This is the main connection for prod and dev, testing uses another DB
 */
import mongoose from "mongoose";

//Connect to mongodb
export default async function connect(){
    try{
        const DB_NAME = process.env.DB_NAME || 'notes';
        await mongoose.connect(process.env.MONGODB_URI,{
            dbName: DB_NAME,
            autoCreate: true
        });
        console.log('Connected to MongoDB');
    }catch(ex){
        console.log('Error connecting to MongoDB:',ex);
    }
}