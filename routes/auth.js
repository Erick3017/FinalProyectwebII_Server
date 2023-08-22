import express from "express";

import { login, register, verifyEmail} from "../controllers/auth.js";


// de esta manera se crean las rutas que se necesitaran para el aplicativo
const router = express.Router();


router.post("/register",register)
router.post("/login",login)
router.get("/verify/:token", verifyEmail); // Ruta para verificación de correo

export default router;