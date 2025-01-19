import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the user schema
const otpSchema = new Schema({

  otp: { type: String, required: true },
  email: { type: String, required: true }, 
  type: { type: String, enum: ['email' , 'mobile'], required: true }, 
  createdAt: { type: Date, default: Date.now, expires: 55 } 
});



// Create the user model from the schema
const otpModel = mongoose.model('Otp', otpSchema);

export default otpModel;
