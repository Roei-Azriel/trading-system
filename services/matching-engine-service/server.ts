import app from './app.js';
import dotenv from "dotenv";



dotenv.config(); 

const port = process.env.PORT ? Number(process.env.PORT) : 30004;


app.listen(port, ()=>{
  console.log(`Matching Engine Service running on port: ${port}`)
})

