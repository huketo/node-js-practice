// modules
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

// Database
import mongoose from "mongoose";

// Controllers
import errorController from "./controllers/error.js";

// Models
import User from "./models/user.js";

const app = express();

// env
dotenv.config();
const PASSWORD = process.env.PASSWORD;

// Templete Engine
app.set("view engine", "ejs");
app.set("views", "views");

// Routes
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";

// MiddleWare

// Public SetPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// SetUser
app.use((req, res, next) => {
  User.findById("63887fdc8625de55ea4d1bb4")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// Set Route
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// Set 404 page
app.use(errorController.get404);

// DB connect & listening
mongoose
  .connect(
    `mongodb+srv://huke:${PASSWORD}@cluster0.9inuqpu.mongodb.net/shop?retryWrites=true&w=majority`
  )
  .then((result) => {
    // create user
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "huke",
          email: "naruto1458@naver.com",
          cart: {
            items: []
          },
        })
        user.save()
      }
    })
    // listrning
    app.listen(3000);
    console.log("Listening port 3000");
  })
  .catch((err) => console.log(err));
