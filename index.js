import express from 'express';
import bodyParser from 'body-parser';
import mongoose from './config/moongoose.js';

import userRouter from './Usercontroller/user.routes.js';

const app = express();

app.use(bodyParser.json());



app.get('/api/new-endpoint',(req,res)=>{
   return res.json({ message : " this is the new end point"});
});


// Mount the userRouter on the /user path
app.use("/user", userRouter);


const port = 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
