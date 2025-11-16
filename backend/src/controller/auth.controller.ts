import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import type { Request, Response } from "express";
import { client } from "../config/db.js";

const RegisterSchema = z.object({
    name: z.string("Name should be a valid string"),
    email: z.email("Not a valid email"),
    password: z.string("Password should be a valid string")
})

const RegisterPartnerSchema = z.object({
    name: z.string("Name should be a valid string"),
    email: z.email("Not a valid email"),
    password: z.string("Password should be a valid string"),
    contactName: z.string("ContactName should be a valid string"),
    phone: z.string("Phone should be a valid Phone no."),
    address: z.string("Name should be a valid string")
})

const LoginSchema = z.object({
    email: z.email("Not a valid email"),
    password: z.string("Password should be a valid string")
})

const GetUserSchema = z.object({
    id: z.string("Should be a valid string")
})

type RegisterInfer = z.infer<typeof RegisterSchema>;
type RegisterPartnerInfer = z.infer<typeof RegisterPartnerSchema>;
type LoginInfer = z.infer<typeof LoginSchema>;
type GetUserInfer = z.infer<typeof GetUserSchema>

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

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "24h" });

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

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password }: LoginInfer = LoginSchema.parse(req.body);

        const isExisted = await client.user.findUnique({
            where: {
                email: email
            }
        });

        if (!isExisted) {
            return res.status(404).json({
                success: false,
                message: "User not exist!"
            })
        };

        const checkPass = await bcrypt.compare(password, isExisted.password);

        if (!checkPass) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials!"
            })
        };

        const token = jwt.sign({ id: isExisted.id }, process.env.JWT_SECRET!, { expiresIn: "24h" })

        res.cookie("token", token);

        res.status(200).json({
            sucess: true,
            message: "User Logined Successfully"
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "failed to login"
        })
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "User LoggedOut successfully"
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "failed to logout user"
        })
    }
}

export const getDbUser = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        res.status(200).json({
            success: true,
            user: user,
            message: "User fetched successfully"
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "failed to fetch user"
        })
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id }: GetUserInfer = GetUserSchema.parse(req.params);
        const user = await client.user.findFirst({
            where: {
                id: id!
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not found"
            })
        };

        res.status(200).json({
            success: true,
            user: user,
            message: "User fetched Successfully",
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "failed to fetch user"
        })
    }
}

export const regsiterFoodPartner = async (req: Request, res: Response) => {
    try {
        const { name, email, password, contactName, phone, address }: RegisterPartnerInfer = RegisterPartnerSchema.parse(req.body);

        const isExisted = await client.foodPartner.findUnique({
            where: {
                email: email
            }
        })

        if (isExisted) {
            return res.status(500).json({
                success: false,
                message: "Partner Already Exist"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const profileImage = await fetch(`https://ui-avatars.com/api/?background=random&name=${name}`).then(res => res.url);

        const user = await client.foodPartner.create({
            data: {
                name: name,
                email: email,
                password: hashPassword,
                imageUrl: profileImage,
                contactName: contactName,
                address: address,
                phone: phone
            }
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "24h" });

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

export const loginFoodPartner = async (req: Request, res: Response) => {
    try {
        const { email, password }: LoginInfer = LoginSchema.parse(req.body);

        const isExisted = await client.foodPartner.findUnique({
            where: {
                email: email
            }
        });

        if (!isExisted) {
            return res.status(404).json({
                success: false,
                message: "User not exist!"
            })
        };

        const checkPass = await bcrypt.compare(password, isExisted.password);

        if (!checkPass) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials!"
            })
        };

        const token = jwt.sign({ id: isExisted.id }, process.env.JWT_SECRET!, { expiresIn: "24h" })

        res.cookie("token", token);

        res.status(200).json({
            sucess: true,
            message: "partner Logined Successfully"
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "failed to login"
        })
    }
}

export const logoutFoodPartner = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "Partner LoggedOut successfully"
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "failed to logout partner"
        })
    }
}
