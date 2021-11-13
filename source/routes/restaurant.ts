import express from "express";
import controller from "../controllers/restaurant";

const router = express.Router();

router.get("/", controller.getAllRestaurants);
router.post("/upload", controller.uploadRestaurantData);

export = router;
