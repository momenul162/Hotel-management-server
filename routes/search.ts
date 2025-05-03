import express from "express";
import { globalSearch } from "../controllers/searchController";

const router = express.Router();

// Correctly pass the controller function as a middleware
router.get("/search", globalSearch);

export const searchRoute = router;
