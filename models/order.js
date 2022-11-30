import Sequelize from "sequelize";
import { sequelize } from "../util/database.js";

export const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});
