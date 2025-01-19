// mongoose.js
import mongoose from 'mongoose';
import otpModel from "../schema/otp.js";

// MongoDB Connection String (replace with your actual connection string)
const mongoURI = 'mongodb+srv://manoharudgiri:i6xlUQnrbxdstt08@hms.zwweu.mongodb.net/?retryWrites=true&w=majority&appName=HMS';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
  console.log('MongoDB connected successfully');
  await otpModel.collection.dropIndex('createdAt_1'); // Drop the existing index
  await otpModel.ensureIndexes(); // Ensure indexes are created
  console.log('Indexes ensured');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
export default mongoose;
