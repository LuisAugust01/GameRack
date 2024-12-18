require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET,
    FILE_PATHS: {
        USERS: process.env.USER_FILE_PATH,
        GAMES: process.env.GAME_FILE_PATH,
        ITEMS: process.env.ITEM_FILE_PATH,
    },
};
