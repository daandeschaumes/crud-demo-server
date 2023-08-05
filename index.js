import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect.js";
import categoryRouter from "./routes/category.routes.js";
import restaurantRouter from "./routes/restaurant.routes.js";
import menuRouter from "./routes/menu-item.routes.js";
import cookieParser from "cookie-parser";
import { credentials } from "./middleware/credentials.js";
import { corsOptions } from "./config/corsOptions.js";

dotenv.config();
const app = express();
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.get("", (req, res) => {
  res.send({ message: "Hello World!" });
});
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/menuitems", menuRouter);

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8080, () =>
      console.log("Server started on port http://localhost:8080")
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
