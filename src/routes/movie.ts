import { Router } from "express";
import { body } from "express-validator";
import { query } from "express-validator";
const movieController = require("../controllers/movieController")

const router: Router = Router();

router.get("/search", [query("title").not().isEmpty().withMessage("Title can not be empty")], movieController.search)

export default router
