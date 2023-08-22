import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const { sendVerificationCode } = require("../utils/twilioService.js").default;

export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const verificationToken = jwt.sign({ email: req.body.email }, process.env.JWT);
        const verificationCode = generateVerificationCode(); // Genera un código de verificación (implementa esta función)

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            verificationToken, // Agregar el token de verificación al usuario
            phoneNumber: req.body.phoneNumber,
            verificationCode,
            isVerify: false,
        });

        await newUser.save();

        // Enviar correo de verificación
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "erickvinicio30@gmail.com",
                pass: "ibphflxmvicgaxbm",
            },
        });

        const verificationLink = `http://localhost:3000/api/auth/verify/${verificationToken}`;

        const mailOptions = {
            from: "erickvinicio30@gmail.com",
            to: req.body.email,
            subject: "Verifica tu correo electrónico",
            html: `Haz clic <a href="${verificationLink}">aquí</a> para verificar tu cuenta.`,
        };

        await transporter.sendMail(mailOptions);
        await sendVerificationCode(newUser.phoneNumber, verificationCode);

        res.status(200).send("User has been created. Check your email to verify your account.");
    } catch (err) {
        next(err);
    }
}

export const verifyEmail = async (req, res, next) => {
    try {
        const token = req.params.token;

        // Verificar el token y extraer el email
        const { email } = jwt.verify(token, process.env.JWT);

        const user = await User.findOneAndUpdate(
            { email, verificationToken: token }, // Buscar por email y token
            { $set: { isVerify: true, verificationToken: "" } }, // Marcar como verificado y borrar el token
            { new: true } // Obtener el usuario actualizado
        );

        if (!user) {
            return res.status(400).json({ error: "Invalid token or user not found." });
        }

        res.status(200).json({ message: "Email verification successful.", user });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user) return next(createError(404, "User not found"));

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (!user.isVerify) return next(createError(403, "Unverified user"));

        // Verificar el código de verificación ingresado por el usuario
        const { verificationCode } = req.body;
        if (user.verificationCode !== verificationCode) {
            return next(createError(400, "Invalid verification code"));
        }

        if (!isPasswordCorrect) return next(createError(400, "Wrong password or username"));


        //jwt para user token y indentificar admin para enviarlo mediante las cookies
        const token = jwt.sign(
            { id: user.id, isAdmin: user.isAdmin },
            process.env.JWT
        );
        const { password, ...otherDetails } = user._doc;
        res.status(200).json({
            token, // Agrega el token al objeto de respuesta
            ...otherDetails // Agrega los otros detalles del usuario
        });
    } catch (err) {
        next(err)
    }
}