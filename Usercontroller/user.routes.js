import express from "express";

import UserController from "../Usercontroller/user.controller.js";

// 2. Initialize Express router.
const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/signup", (req, res) => {
    userController.SignUp(req, res);
  });
  
  userRouter.post("/signin", (req, res) => {
    userController.SignIn(req, res);
  });
  
  userRouter.post("/send-mobile-otp", (req, res) => {
    userController.sendMobileOtp(req, res);
});

  userRouter.post("/verify-mobile-otp", (req, res) => {
    userController.verifyMobileOtp(req, res);
  });

  export default userRouter;