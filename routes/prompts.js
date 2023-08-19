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

router.post("/",createPrompt)
router.post("/execute",ExecutePrompt)
// IT IS CALLED THE FUNCTION UPDATE OF CONTROLLER
router.put("/:id", updatePrompt)
// IT IS CALLED THE FUNCTION DELETE OF CONTROLLER
router.delete("/:id", deletePrompt)
// IT IS CALLED THE FUNCTION GET OF CONTROLLER
router.get("/",getPrompt)

router.get("/:iduser",verifyUser,getPromptsByUser)
export default router;