import express from "express";
import {
    updateUser,
    getUser,
    deleteUser,
    getUsers,
    createUser
} from "../controllers/user.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";
const router = express.Router();

router.post("/",verifyAdmin, createUser)
router.put("/:id", verifyAdmin, updateUser)
router.delete("/:id", verifyAdmin, deleteUser)
router.get("/:id", verifyAdmin, getUser)
router.get("/", verifyAdmin, getUsers)


export default router;