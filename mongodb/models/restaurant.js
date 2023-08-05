import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String },
  allMenuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

const restaurantModel = mongoose.model("Restaurant", RestaurantSchema);

export default restaurantModel;
