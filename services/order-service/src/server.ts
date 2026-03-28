import app from './app.js';
import dotenv from "dotenv";



dotenv.config(); 

const port = process.env.PORT ? Number(process.env.PORT) : 30002;


app.listen(port, ()=>{
  console.log(`Order Service running on port: ${port}`)
})

