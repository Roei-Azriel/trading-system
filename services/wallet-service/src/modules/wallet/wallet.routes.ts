import { Router } from "express";
import * as controller from './wallet.controller.js'


const router = Router();

router.post("/:userId/createWallet", controller.createWallet);
router.get("/:userId/balances", controller.getBalances);
router.post("/:userId/credit" , controller.credit);
router.post("/:userId/debit" , controller.debit);
router.get("/:userId/getWallet" , controller.getUserWallet);

export default router;
