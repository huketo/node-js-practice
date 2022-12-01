// modules
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

// Database
import { mongoConnect } from "./util/database.js";

// Controllers
import errorController from "./controllers/error.js";

// Models
import { User } from "./models/user.js";

const app = express();

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
  User.findById("6388386fd16bcdd028967834")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

// Set Route
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// Set 404 page
app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
