import Category from "../mongodb/models/category.js";
import Restaurant from "../mongodb/models/restaurant.js";
import MenuItem from "../mongodb/models/menu-item.js";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
const getAllCategories = async (req, res) => {
  // const {
  //   _end,
  //   _order,
  //   _start,
  //   _sort,
  //   title_like = "",
  //   propertyType = "",
  // } = req.query;
  // const query = {};
  // if (propertyType != "") query.propertyType = propertyType;
  // if (title_like) query.title = { $regex: title_like, $options: "i" };

  try {
    const count = await Category.countDocuments();

    const categories = await Category.find().populate("allRestaurants");
    // .limit(_end)
    // .skip(_start)
    // .sort({ [_sort]: _order })
    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const categoryExists = await Category.findOne({ _id: id }).populate(
    "allRestaurants"
  );

  if (categoryExists) res.status(200).json(categoryExists);
  else res.status(404).json({ message: "Category not found" });
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, photo } = req.body;

    let photoUrl = "";
    if (photo != "") {
      photoUrl = await cloudinary.uploader.upload(photo);
    }

    await Category.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        photo: photoUrl != "" ? photoUrl.url : photoUrl,
      }
    );
    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { title, description, photo } = req.body;


    //start a new session...
    const session = await mongoose.startSession();
    session.startTransaction();

    let photoUrl = "";
    if (photo != "") {
      photoUrl = await cloudinary.uploader.upload(photo);
    }

    const newCategory = await Category.create({
      title,
      description,
      photo: photoUrl != "" ? photoUrl.url : photoUrl,
    });
    await newCategory.save({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Category created succesfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const categoryToDelete = await Category.findById({ _id: id }).populate(
      "allRestaurants"
    );
    if (!categoryToDelete) throw new Error("Category not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    categoryToDelete.deleteOne({ session });
    const rest = await Restaurant.where("category").equals(id);
    await MenuItem.deleteMany({ restaurant: rest._id });
    await Restaurant.deleteMany({ category: id });

    await session.commitTransaction();

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllCategories,
  createCategory,
  getCategoryById,
  deleteCategory,
  updateCategory,
};
