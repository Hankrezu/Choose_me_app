const config = require("./package.json").projectConfig;

module.exports = {
  mongoConfig: {
    connectionUrl: config.mongoConnectionUrl,
    database: "foodelivery_db",
    collections: {
      USERS: "users",
      RESTAURANTS: "restaurants",
      CARTS: "carts",
      FOODS: "foods",
      BOOKMARKS: "bookmarks",
      CATEGORIES: "categories",
      ORDERS: "orders",  // Ensure orders collection is included
      REVIEWS:"reviews"
    },
  },
  serverConfig: {
    ip: config.serverIp,
    port: config.serverPort,
  },
  tokenSecret: "foodelivery_secret",
};
