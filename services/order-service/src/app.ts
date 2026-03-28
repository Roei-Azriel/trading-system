import express from "express";
import cors from "cors";
import helmet from "helmet";
import orderRoutes from './modules/order/order.routes.js';

const app =express();
app.use(helmet());
app.use(express.json());
app.use("/order",orderRoutes);


app.get("/healthz", (_req, res) => res.json({ ok: true }));


app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  const status = err?.statusCode || 500;
  res.status(status).json({ error: err?.message || "INTERNAL_ERROR" });
});


export default app;