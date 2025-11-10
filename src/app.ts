import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import userRoutes from "./modules/user/user.routes.js";
import walletRoutes from "./modules/wallet/wallet.routes.js";

dotenv.config(); 

const app = express();

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, ()=>{
  console.log(`Server running on port: ${port}`)
})

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/wallets", walletRoutes);

app.get("/healthz", (_req, res) => res.json({ ok: true }));

// Basic error handler (you can replace with a better one in common/http.ts)
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  const status = err?.statusCode || 500;
  res.status(status).json({ error: err?.message || "INTERNAL_ERROR" });
});
