import { Request, Response, NextFunction } from "express";
import logging from "../config/logging";
import { Connect, Query } from "../config/mysql";

const NAMESPACE = "Restaurants";

const uploadRestaurantData = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, "Uploading all data of restaurants");

  const csvtojson = require("csvtojson");
  const restaurantFileData = `${__dirname}/../data/restaurants.csv`;

  csvtojson()
    .fromFile(restaurantFileData)
    .then((source: any) => {
      Connect()
        .then((connection) => {
          const openingHours = new Array();

          const restaurantsPromise = () => {
            return new Promise((resolve, reject) => {
              for (let i = 0; i < source.length; i++) {
                const resto = source[i]["Restaurant Name"],
                  rawOpeningHour = source[i]["Opening Hours"];

                const truncateRestaurant = "TRUNCATE TABLE restaurants;";
                const truncateSchedule = "TRUNCATE TABLE restaurant_schedules;";

                const insertRestaurant = `INSERT INTO restaurants (name) VALUES ("${resto}")`;

                connection.query(insertRestaurant, (error, result) => {
                  if (error) {
                    logging.error(NAMESPACE, error.message, error);

                    throw error;
                  }

                  const splitedHour = rawOpeningHour.split("/");

                  for (let j = 0; j < splitedHour.length; j++) {
                    openingHours.push({
                      resto_id: result.insertId,
                      opening_hour: splitedHour[j].trim()
                    });
                  }

                  if (source.length == i + 1) {
                    resolve(openingHours);
                  }
                });
              }
            });
          };

          restaurantsPromise().then((restaurants: any) => {
            for (let i = 0; i < restaurants.length; i++) {
              const insertRestaurantSchedules = `INSERT INTO restaurant_schedules (resto_id, opening_hour) VALUES (${restaurants[i]["resto_id"]},"${restaurants[i]["opening_hour"]}")`;

              connection.query(insertRestaurantSchedules, [restaurants], function (error) {
                if (error) {
                  logging.error(NAMESPACE, error.message, error);

                  throw error;
                }
              });
            }
            connection.end();

            return res.status(200).json({
              message: "upload is successfull"
            });
          });
        })
        .catch((error) => {
          logging.error(NAMESPACE, error.message, error);

          return res.status(500).json({
            message: error.message,
            error
          });
        });
    });
};

const getAllRestaurants = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, "Getting all restaurants");

  let query = "";

  Connect()
    .then((connection) => {
      Query(connection, query)
        .then((results) => {
          return res.status(200).json({
            results
          });
        })
        .catch((error) => {
          logging.error(NAMESPACE, error.message, error);

          return res.status(500).json({
            message: error.message,
            error
          });
        })
        .finally(() => {
          connection.end();
        });
    })
    .catch((error) => {
      logging.error(NAMESPACE, error.message, error);

      return res.status(500).json({
        message: error.message,
        error
      });
    });
};

export default { getAllRestaurants, uploadRestaurantData };
