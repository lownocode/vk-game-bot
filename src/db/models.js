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
        defaultValue: 1_500,
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
    reposts: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: []
    }
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
        defaultValue: null,
    },
    modeRoundTime: {
        type: DataTypes.JSONB,
        defaultValue: {
            slots: 15,
            dice: 15,
            double: 15,
            basketball: 15,
            wheel: 15,
            under7over: 15
        }
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    payer: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    payedFor: {
        type: DataTypes.BIGINT
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
        type: DataTypes.INTEGER,
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
    mode: {
        type: DataTypes.STRING
    }
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
        type: DataTypes.INTEGER,
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
    },
})

export const ChatRate = sequelize.define("chat_rates", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    peerId: {
        type: DataTypes.INTEGER,
    },
    userId: {
        type: DataTypes.INTEGER,
    },
    betAmount: {
        type: DataTypes.BIGINT,
    },
    data: {
        type: DataTypes.JSON
    },
    mode: {
        type: DataTypes.STRING
    },
    percentOfBetAmount: {
        type: DataTypes.BIGINT,
    }
})