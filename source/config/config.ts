import dotenv from "dotenv";

dotenv.config();

const MSYQL_HOST = process.env.MYSQL_HOST || "localhost";
const MSYQL_DATABASE = process.env.MSYQL_DATABASE || "glintsomato";
const MSYQL_USER = process.env.MYSQL_USER || "root";
const MSYQL_PASSWORD = process.env.MYSQL_PASSWORD || "123456";

const MYSQL = {
  host: MSYQL_HOST,
  database: MSYQL_DATABASE,
  user: MSYQL_USER,
  password: MSYQL_PASSWORD
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || 1337;

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT
};

const config = {
  mysql: MYSQL,
  server: SERVER
};

export default config;
