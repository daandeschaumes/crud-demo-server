import express from "express";

import {
  deleteMenuItem,
  getMenuDetail,
  updateMenuItem,
  createMenuItem,
} from "../controllers/menu-item.controller.js";

const router = express.Router();

// router.route("/").get(getAllCategories);
router.route("/:id").get(getMenuDetail);
router.route("/").post(createMenuItem);
router.route("/:id").patch(updateMenuItem);
router.route("/:id").delete(deleteMenuItem);

export default router;
