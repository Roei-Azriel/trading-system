import { Router } from "express";
import * as controller from "./order.controller.js";

const router = Router();

router.post("/:userId/orders", controller.newOrder);
router.post("/:userId/orders/:id/cancel", controller.cancelOrder);

export default router;
