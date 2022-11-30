// modules
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

// Database
import { sequelize } from "./util/database.js";

// Controllers
import errorController from "./controllers/error.js";

// Models
import { Product } from "./models/product.js";
import { User } from "./models/user.js";
import { Cart } from "./models/cart.js";
import { CartItem } from "./models/cart-item.js";
import { Order } from "./models/order.js";
import { OrderItem } from "./models/order-item.js";

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
  User.findByPk(1)
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

// Set Database 1:1 1:N N:N
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// Sync DB & Listening
sequelize
  //.sync({force: true})
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Huke", email: "test@email.com" });
    }
    return user;
  })
  .then((user) => {
    // console.log(user);
    return user.createCart();
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
