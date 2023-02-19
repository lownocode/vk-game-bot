import Sequelize from "sequelize"

import { sequelize } from "./sequelize.js"

const { DataTypes } = Sequelize

export const User = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    vkId: {
        type: DataTypes.INTEGER,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
    },
    balance: {
        type: DataTypes.BIGINT,
        defaultValue: 1_000_000,
    },
    newsletter: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    winCoinsToday: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    winCoins: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    isBanned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isSubscribedOnGroup: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    bonusReceivedTime: {
        type: DataTypes.BIGINT
    },
})

export const Chat = sequelize.define("chats", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    peerId: {
        type: DataTypes.INTEGER,
        unique: true,
    },
    mode: {
        type: DataTypes.STRING,
        default: "",
    },
})

export const Game = sequelize.define("games", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    peerId: {
        type: DataTypes.BIGINT,
    },
    endedAt: {
        type: DataTypes.BIGINT
    },
    secretString: {
        type: DataTypes.STRING,
    },
    salt: {
        type: DataTypes.STRING,
    },
    hash: {
        type: DataTypes.STRING
    },
    data: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
})

export const Rate = sequelize.define("rates", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    gameId: {
        type: DataTypes.INTEGER,
    },
    peerId: {
        type: DataTypes.BIGINT,
    },
    userVkId: {
        type: DataTypes.INTEGER,
    },
    betAmount: {
        type: DataTypes.BIGINT,
    },
    username: {
        type: DataTypes.STRING,
    },
    data: {
        type: DataTypes.JSON
    },
    mode: {
        type: DataTypes.STRING
    }
})