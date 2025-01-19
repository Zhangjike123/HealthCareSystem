import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const { Schema } = mongoose;

// Define the user schema
const userSchema = new Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  isVerfiedUser: { type: Boolean, default: false },   
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },    
  type: { type: String, enum: ['admin', 'patient', 'doctor'], required: true }, 
  age: { type: Number, required: true },        
  address: { type: String, required: true },     
  gender: { type: String, enum: ['male', 'female', 'other'], required: true }, 

});


  // Middleware to hash password before saving
  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Skip if password hasn't been modified
    
    try {
      // Generate a salt with 10 rounds
      const salt = await bcrypt.genSalt(10);
      
      // Hash the password with the salt
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  });


// Create the user model from the schema
const userModel = mongoose.model('User', userSchema);

export default userModel;
