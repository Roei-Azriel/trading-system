import { Router } from "express";
import * as controller from './wallet.controller.js'


const router = Router();

router.get("/:userId/balances", controller.getBalances);
router.post("/:userId/credit" , controller.getCredit);

export default router;