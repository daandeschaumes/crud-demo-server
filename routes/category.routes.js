import express from "express";

import {
  getAllCategories,
  createCategory,
  getCategoryById,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.route("/").get(getAllCategories);
router.route("/:id").get(getCategoryById);
router.route("/").post(createCategory);
router.route("/:id").patch(updateCategory);
router.route("/:id").delete(deleteCategory);

export default router;
