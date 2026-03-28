import app from './app.js';
import dotenv from "dotenv";



dotenv.config(); 

const port = process.env.PORT ? Number(process.env.PORT) : 30001;


app.listen(port, ()=>{
  console.log(`User Service running on port: ${port}`)
})

