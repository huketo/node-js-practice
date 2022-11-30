import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("node-complete", "root", "password", {
  dialect: "mysql",
  host: "192.168.120.197",
});