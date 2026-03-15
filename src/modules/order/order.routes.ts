import { Router } from "express";
import * as controller from "./order.controller.js";

const router = Router();

router.get("/orders/open" , controller.openOrder);
router.post("/orders/:id/canel", controller.cancelOrder);
router.post("/orders/new", controller.newOrder);
