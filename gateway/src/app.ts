import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(helmet());
app.use(cors());

app.get("/healthz", (_req, res) => res.json({ ok: true }));

app.use(
  createProxyMiddleware({
    target: "http://localhost:30001",
    changeOrigin: true,
    pathFilter: "/users",
    pathRewrite: (path) => path.replace(/^\/users/, "/user"),
  })
);

app.use(
  createProxyMiddleware({
    target: "http://localhost:30003",
    changeOrigin: true,
    pathFilter: "/wallets",
    pathRewrite: (path) => path.replace(/^\/wallets/, "/wallet"),
  })
);

app.use(
  createProxyMiddleware({
    target: "http://localhost:30002",
    changeOrigin: true,
    pathFilter: "/orders",
    pathRewrite: (path) => path.replace(/^\/orders/, "/order"),
  })
);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  const status = err?.statusCode || 500;
  res.status(status).json({ error: err?.message || "INTERNAL_ERROR" });
});

app.listen(port, () => {
  console.log(`Gateway running on port: ${port}`);
});
