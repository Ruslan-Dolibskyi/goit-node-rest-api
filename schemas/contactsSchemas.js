import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[0-9\- ]+$/).required(),
    favorite: Joi.boolean().optional(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\+?[0-9\- ]+$/),
    favorite: Joi.boolean(),
}).min(1).messages({
    "object.min": "Передайте хоча б одне поле для оновлення",
});

export const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required().messages({
        "any.required": "Поле 'favorite' є обов'язковим",
        "boolean.base": "Поле 'favorite' повинно бути true або false",
    }),
});
