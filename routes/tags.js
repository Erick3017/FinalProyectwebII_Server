import express from "express";
import {
    updateTag,
    getTag,
    deleteTag,    
    createTag    
} from "../controllers/tag.js";
import { verifyUser } from "../utils/verifyToken.js";
const router = express.Router();

router.post("/",createTag)
router.put("/:id", updateTag)
router.delete("/:id", deleteTag)
router.get("/", getTag)



export default router;