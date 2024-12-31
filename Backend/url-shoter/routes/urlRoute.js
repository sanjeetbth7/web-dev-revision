import express from "express";
import { createShortUrl,handleGetUrl } from "../controller/urlController.js";
const router = express.Router();


router.route("/").get((req,res)=> res.json({message : "Hello from server!"}))
router.route("/:id").get(handleGetUrl)
router.route("/url").post(createShortUrl)

export default router;