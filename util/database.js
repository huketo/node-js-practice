import * as dotenv from "dotenv";
import mongodb from "mongodb";

dotenv.config();

const MongoClient = mongodb.MongoClient;
const PASSWORD = process.env.PASSWORD;

let _db;

export const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://huke:${PASSWORD}@cluster0.9inuqpu.mongodb.net/?retryWrites=true&w=majority`
  )
    .then((client) => {
      console.log("MongoDB Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};
