import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());


app.get("/healthz", (req, res) => res.json({ ok: true }));


app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  const status = err?.statusCode || 500;
  res.status(status).json({ error: err?.message || "INTERNAL_ERROR" });
});


export default app;
