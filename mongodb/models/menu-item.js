import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
});

const menuItemModel = mongoose.model("MenuItem", MenuItemSchema);

export default menuItemModel;
