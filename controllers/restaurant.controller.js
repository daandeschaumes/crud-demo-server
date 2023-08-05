import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Category from "../mongodb/models/category.js";
import Restaurant from "../mongodb/models/restaurant.js";
import MenuItem from "../mongodb/models/menu-item.js";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getRestaurant = async (req, res) => {
  const { id } = req.params;
  const restaurantExists = await Restaurant.findOne({ _id: id }).populate(
    "allMenuItems"
  );

  if (restaurantExists) res.status(200).json(restaurantExists);
  else res.status(404).json({ message: "Restaurant was not found" });
};
const createRestaurant = async (req, res) => {
  try {
    const { title, description, photo, categoryId } = req.body;


    //start a new session...
    const session = await mongoose.startSession();
    session.startTransaction();

    const existingCategory = await Category.findOne({
      _id: categoryId,
    }).session(session);
    if (!existingCategory) throw new Error("Category not found");
    let photoUrl = "";
    if (photo != "") {
      photoUrl = await cloudinary.uploader.upload(photo);
    }

    const newRestaurant = await Restaurant.create({
      title,
      description,
      photo: photoUrl != "" ? photoUrl.url : photoUrl,
      category: existingCategory._id,
    });

    newRestaurant.allMenuItems.push(await MenuItem.create());
    existingCategory.allRestaurants.push(newRestaurant._id);
    await existingCategory.save({ session });
    await session.commitTransaction();

    res.status(200).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateRestaurant = async (req, res) => {

  try {
    const { id } = req.params;
    const { title, description, photo } = req.body;

    let photoUrl = "";
    if (photo != "") {
      photoUrl = await cloudinary.uploader.upload(photo);
    }

    await Restaurant.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        photo: photoUrl != "" ? photoUrl.url : photoUrl,
      }
    );
    res.status(200).json({ message: "Property updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurantToDelete = await Restaurant.findById({ _id: id }).populate(
      "category"
    );

    if (!restaurantToDelete) throw new Error("Restaurant not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    restaurantToDelete.deleteOne({ session });
    restaurantToDelete.category.allRestaurants.pull(restaurantToDelete);

    await restaurantToDelete.category.save({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getRestaurant, updateRestaurant, deleteRestaurant, createRestaurant };
