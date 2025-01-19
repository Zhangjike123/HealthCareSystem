import userModel from "../schema/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import { generateRandom4DigitNumber } from "../utility/helper.function.js";
import otpModel from "../schema/otp.js";
import transporter from "../config/nodemailer.js";


class UserController {
  // SignUp Method
  async SignUp(req, res) {
    const data = req.body;

    try {
      // Check if a user with the provided email already exists
      const existingUser = await userModel.findOne({ email: data.email });

      if (existingUser) {
        // If the user exists, return a 400 response with an error message
        return res.status(400).json({ message: "Email already in use" });
      }

     // If no existing user, proceed with creating a new user
      const user = new userModel(data);
      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;

      // Return 201 status code for successful creation
      res.status(201).json({ message: "User successfully signed up", data: userResponse });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
  }

  // SignIn Method
  async SignIn(req, res) {
    const { email, password } = req.body; // Get email and password from the request body

    try {
      // Check if the user exists
      const user = await userModel.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Compare password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        console.log("User ID for JWT:", user._id.toString()); // Debugging the userID

        // Generate the JWT token
        const token = jwt.sign(
          {
            userID: user._id.toString(),  // Use user object for ID and email
            email: user.email,
          },
          'GnRVSIBFPF2R4ezZWivNZV85qEB0yVfn',  // Use an environment variable for the secret
          { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Send the JWT token in the response
        return res.status(200).json({ token });
      } else {
        return res.status(400).json({ message: "Invalid email or password" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
  }
  async sendMobileOtp(req, res) {

    const apiKeyForOtp = "TbQDydw9pFqAl42YNrKX5v78nkBgPiEHo1cexMtWGVCjUZusL09YwKrT32hjSkzPZO5NBApRV8suMLqG";

    const { token, mobile } = req.body;
  
    try {
      const jwtData = jwt.verify(token, 'GnRVSIBFPF2R4ezZWivNZV85qEB0yVfn');
      const email = jwtData.email;
      const user = await userModel.findOne({ email: email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const otp = generateRandom4DigitNumber();
      console.log('Generated OTP:', otp);
  
      const sendOtpApi = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKeyForOtp}&variables_values=${otp}&route=otp&numbers=${mobile}`;
   
      const response = await axios.get(sendOtpApi);
      console.log('Fast2SMS Response:', response.data);
  
         if (response.data.return) {
            const otpData = {
              otp:  otp,
              email: email,
              type: 'mobile',
            };
            const otpModelInstance = new otpModel(otpData);
            await otpModelInstance.save();

           return res.status(200).json({ message: 'OTP sent successfully' });
         } else {
           return res.status(400).json({ message: 'Failed to send OTP', details: response.data });
         }
  
        } catch (err) {
         console.error('Error in OTP API request:', err);
         return res.status(400).json({ message: 'Failed to send OTP', error: err.message });
        }
 }

 async verifyMobileOtp(req, res) {
  const { token, mobile, otp } = req.body;

  try {
    const jwtData = jwt.verify(token, 'GnRVSIBFPF2R4ezZWivNZV85qEB0yVfn');

    const email = jwtData.email;
    const user  = await userModel.findOne({ email: email });  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }   
    const otpData = await otpModel.findOne({ email, otp, type: 'mobile' });
    if (otpData) {
      
      user.mobile = mobile;
      user.isVerfiedUser = true;
      await user.save();

      return res.status(200).json({ message: 'OTP verified successfully' });

    } else {
      return res.status(400).json({ message: 'Invalid OTP' });
    } 
  }
    catch (err) { 
      console.error('Error in OTP verification:', err);
      return res.status(400).json({ message: 'Failed to verify OTP', error: err.message }); 

    }

  }
  


}

export default UserController;
