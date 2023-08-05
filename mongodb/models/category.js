import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String },
  allRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }],
});

const categoryModel = mongoose.model("Category", CategorySchema);

export default categoryModel;
