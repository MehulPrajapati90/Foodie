import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import type { Request, Response } from "express";
import { client } from "../config/db.js";

const RegisterSchema = z.object({
    name: z.string("Name should be a string"),
    email: z.email("Not a valid email"),
    password: z.string("Password should be a string")
})

type RegisterInfer = z.infer<typeof RegisterSchema>;

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password }: RegisterInfer = RegisterSchema.parse(req.body);

        const isExisted = await client.user.findUnique({
            where: {
                email: email
            }
        })

        if (isExisted) {
            return res.status(500).json({
                success: false,
                message: "User Already Exist"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const profileImage = await fetch(`https://ui-avatars.com/api/?background=random&name=${name}`).then(res => res.url);

        const user = await client.user.create({
            data: {
                name: name,
                email: email,
                password: hashPassword,
                imageUrl: profileImage
            }
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_KEY!, { expiresIn: "24h" });

        res.cookie("token", token);

        res.status(201).json({
            success: true,
            message: "Register Successfully"
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Failed to register"
        })
    }
}

export const loginUser = async () => {
    
}