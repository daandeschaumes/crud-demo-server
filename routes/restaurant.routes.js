import express from "express";

import {
  getRestaurant,
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
} from "../controllers/restaurant.controller.js";

const router = express.Router();

router.route("/:id").get(getRestaurant);
router.route("/").post(createRestaurant);
router.route("/:id").patch(updateRestaurant);
router.route("/:id").delete(deleteRestaurant);

export default router;
