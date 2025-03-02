import { DataTypes } from "sequelize";
import sequelize from "../Sequelize.js";

const User = sequelize.define("User", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subscription: {
        type: DataTypes.ENUM,
        values: ["starter", "pro", "business"],
        defaultValue: "starter",
    },
    token: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
}, {
    tableName: "users",
    timestamps: false,
});

export default User;

// User.sync();