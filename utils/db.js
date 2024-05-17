import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_PRODUCTION_URI);
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

const disconnectDb = async () => {
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

export { connectDb, disconnectDb };
