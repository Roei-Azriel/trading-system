import type { Request, Response } from "express";

export async function getBalances(req: Request, res: Response) {
  // TODO: validate req.params.userId and call service
  return res.status(501).json({ todo: "implement getBalances" });
}

export async function getCredit(req: Request, res: Response) {
  // TODO: validate req.params.userId and req.body (assetCode, amount), then call service
  return res.status(501).json({ todo: "implement credit" });
}

export async function debit(req: Request, res: Response) {
  // TODO: validate req.params.userId and req.body (assetCode, amount), then call service
  return res.status(501).json({ todo: "implement debit" });
}
