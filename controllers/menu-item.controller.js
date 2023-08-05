import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Category from "../mongodb/models/category.js";
import Restaurant from "../mongodb/models/restaurant.js";
import MenuItem from "../mongodb/models/menu-item.js";

dotenv.config();

const getMenuDetail = async (req, res) => {
  const { id } = req.params;
  const menuItemExists = await MenuItem.findOne({ _id: id });
  if (menuItemExists) res.status(200).json(menuItemExists);
  else res.status(404).json({ message: "menuItem was not found" });
};

const createMenuItem = async (req, res) => {
  try {
    const { title, restaurantId } = req.body;

    //start a new session...
    const session = await mongoose.startSession();
    session.startTransaction();

    const existingRestaurant = await Restaurant.findOne({
      _id: restaurantId,
    }).session(session);
    if (!existingRestaurant) throw new Error("Restaurant not found");

    const newMenuItem = await MenuItem.create({
      title,
    });

    existingRestaurant.allMenuItems.push(newMenuItem._id);
    await existingRestaurant.save({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "MenuItem created succesfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  console.log(req.body);
  console.log(req.params);

  try {
    const { id } = req.params;
    const { title } = req.body;

    await MenuItem.findByIdAndUpdate(
      { _id: id },
      {
        title,
      }
    );
    res.status(200).json({ message: "MenuItem updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItemToDelete = await MenuItem.findById({ _id: id });

    if (!menuItemToDelete) throw new Error("MenuItem not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    menuItemToDelete.deleteOne({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { updateMenuItem, getMenuDetail, deleteMenuItem, createMenuItem };
