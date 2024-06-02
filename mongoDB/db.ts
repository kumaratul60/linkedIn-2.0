import mongoose from "mongoose";

const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@clusterlinkedin2.p0pdmhq.mongodb.net/?retryWrites=true&w=majority&appName=ClusterLinkedIn2`

if (!connectionString) {
    throw new Error('Please provide a valid connection string')
}

const connectDB = async () => {
    if (mongoose.connection?.readyState >= 1) {
        console.log("----- Already connected to MongoDB ------");
        /***
         * Connection ready state
            0 = disconnected
            1 = connected
            2 = connecting
            3 = disconnecting
            99 = uninitialized
         */
        return;
    }

    try {
        console.log("----- Connecting to MongoDB -----");
        await mongoose.connect(connectionString)
    } catch (error) {
        console.log("Error connecting to MongoDB", error);

    }

}