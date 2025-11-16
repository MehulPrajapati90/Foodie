import type { Request, Response } from "express";
import { client } from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from "../service/storage.services.js"
import { z } from "zod";

const CreateFoodSchema = z.object({
    name: z.string("Name should be a valid string").max(50).min(2),
    description: z.string("Description should be a valid string").max(500).min(2),
})

type CreateFoodInfer = z.infer<typeof CreateFoodSchema>;

export const getFoodPartnerById = async (req: Request, res: Response) => {
    try {
        const foodPartnerId = req.params.id;

        const foodPartner = await client.foodPartner.findFirst({
            where: {
                id: foodPartnerId!
            }
        });
        const foodItemsByFoodPartner = await client.food.findMany({
            where: {
                foodPartnerId: foodPartnerId!
            }
        })

        if (!foodPartner) {
            return res.status(404).json({ message: "Food partner not found" });
        }

        res.status(200).json({
            message: "Food partner retrieved successfully",
            foodPartner: {
                ...foodPartner,
                foodItems: foodItemsByFoodPartner
            }

        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            error: "Failed to fetch"
        })
    }
};

export const getFoodItems = async (req: Request, res: Response) => {
    try {
        const foodItem = await client.food.findMany({
            select: {
                name: true,
                description: true,
                id: true,
                createdAt: true,
                video: true,
                likeCount: true,
                saveCount: true,
                partner: {
                    select: {
                        id: true,
                        name: true,
                        contactName: true,
                        phone: true,
                        address: true,
                        imageUrl: true
                    }
                }
            },
        })

        res.status(200).json({
            success: true,
            message: "fetched successfully",
            foodItem: foodItem
        })
    } catch (e) {
        return res.status(500).json({
            success: false,
            error: "Failed to fetch"
        })
    }
}

export const likeFood = async (req: Request, res: Response) => {
    try {
        const { foodId } = req.body;
        const user = req.user;

        const isAlreadyLiked = await client.likes.findFirst({
            where: {
                userId: user.id,
                foodId: foodId
            }
        });

        if (isAlreadyLiked) {

            await client.likes.deleteMany({
                where: {
                    userId: user.id,
                    foodId: foodId
                }
            });

            await client.food.update({
                where: { id: foodId },
                data: {
                    likeCount: { decrement: 1 }
                }
            });

            return res.status(200).json({
                success: true,
                message: "Food unliked successfully"
            });
        }

        const like = await client.likes.create({
            data: {
                userId: user.id,
                foodId: foodId
            }
        });

        await client.food.update({
            where: { id: foodId },
            data: {
                likeCount: { increment: 1 }
            }
        });

        return res.status(201).json({
            success: true,
            message: "Food liked successfully",
            like: like
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            error: "Failed to like"
        });
    }
};

export const getSaveFood = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const savedItems = await client.save.findMany({
            where: {
                userId: user?.id
            },
            include: {
                food: {
                    select: {
                        name: true,
                        video: true,
                        foodPartnerId: true,
                        description: true,
                        likeCount: true,
                        saveCount: true,
                        createdAt: true
                    }
                },
            }
        });

        if (!savedItems || savedItems.length === 0) {
            return res.status(404).json({ success: false, message: "No saved foods found" });
        }

        res.status(200).json({
            success: true,
            message: "fetched successfully",
            savedItems: savedItems
        })

    } catch (e) {
        return res.status(500).json({
            success: false,
            error: "Failed to liked"
        })
    }
}
export const saveFood = async (req: Request, res: Response) => {
    try {
        const { foodId } = req.body;
        const user = req.user;

        const isAlreadySaved = await client.save.findFirst({
            where: {
                userId: user.id,
                foodId: foodId
            }
        });

        if (isAlreadySaved) {
            await client.save.deleteMany({
                where: {
                    userId: user.id,
                    foodId: foodId
                }
            });

            await client.food.update({
                where: { id: foodId },
                data: {
                    likeCount: { decrement: 1 }
                }
            });

            return res.status(200).json({
                success: true,
                message: "Food unSaved successfully"
            });
        }

        const save = await client.save.create({
            data: {
                userId: user.id,
                foodId: foodId
            }
        });

        await client.food.update({
            where: { id: foodId },
            data: {
                likeCount: { increment: 1 }
            }
        });

        return res.status(201).json({
            success: true,
            message: "Food saved successfully",
            save: save
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            error: "Failed to save"
        });
    }
}

export const createFood = async (req: Request, res: Response) => {
    try {
        const fileUploadResult = await uploadFile(req?.file?.buffer!, uuidv4());
        const { name, description }: CreateFoodInfer = CreateFoodSchema.parse(req.body);

        const foodItem = await client.food.create({
            data: {
                name: name,
                description: description,
                video: fileUploadResult?.url!,
                foodPartnerId: req?.foodPartner?.id
            }
        })

        res.status(201).json({
            message: "food created successfully",
            food: foodItem
        })

    } catch (e) {
        return res.status(500).json({
            success: false,
            error: "Failed to liked"
        })
    }
}