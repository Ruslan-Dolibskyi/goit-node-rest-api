import { DataTypes } from "sequelize";
import sequelize from "../Sequelize.js";


export const Contact = sequelize.define("Contact", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    favorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: "contacts",
    timestamps: false,
});

// Contact.sync();
