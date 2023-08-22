import express from "express";
import {
    updatePrompt,
    getPrompt,
    deletePrompt,    
    createPrompt,
    getPromptsByUser,
    ExecutePrompt
} from "../controllers/prompts.js";
import { verifyUser } from "../utils/verifyToken.js"; 
const router =  express.Router();

router.post("/", createPrompt)
router.post("/execute",ExecutePrompt)
router.put("/:id", updatePrompt)
router.delete("/:id", deletePrompt)
router.get("/", getPrompt)

router.get("/:iduser",verifyUser,getPromptsByUser)
export default router;