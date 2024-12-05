const fs = require('fs/promises');

// Lê os dados de um arquivo JSON
const readJson = async (filePath) => {
    const data = await fs.readFile(filePath);
    return JSON.parse(data);
};

// Escreve dados em um arquivo JSON
const writeJson = async (filePath, data) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

module.exports = { readJson, writeJson };
