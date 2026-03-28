import app from './app.js'
import dotenv from "dotenv";


dotenv.config();


const port = process.env.PORT ? Number(process.env.PORT) : 30003;

app.listen(port , () =>{
    console.log(`Wallet Service running on port : ${port}`)
})


