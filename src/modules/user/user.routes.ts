import { Router } from "express";
import * as controller from "./user.controller.js";

const router = Router();

// Define your routes — handlers are stubs for now.
router.post("/new-user", controller.createUser);           // POST /users
router.delete("/:id", controller.deleteUser);      // DELETE /users/:id
router.post("/:id/password", controller.changePassword); // POST /users/:id/password

export default router;
