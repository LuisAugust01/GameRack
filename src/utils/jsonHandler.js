const fs = require('fs/promises');

const readJson = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

const writeJson = async (filePath, data) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

module.exports = { readJson, writeJson };