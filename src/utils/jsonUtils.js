const fs = require('fs');
const path = require('path');

const readJson = async (filePath) => {
    try {
        console.log("Lendo arquivo:", filePath);
        const data = await fs.promises.readFile(filePath, 'utf-8');
        console.log("Dados lidos:", data);
        return JSON.parse(data);
    } catch (error) {
        console.error("Erro ao ler o arquivo:", error);
        throw new Error("Erro ao ler o arquivo JSON");
    }
};

const writeJson = async (filePath, data) => {
    try {
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));  // Escreve os dados de volta no arquivo
        console.log("Dados salvos com sucesso!");
    } catch (error) {
        console.error("Erro ao escrever no arquivo:", error);
        throw new Error("Erro ao escrever no arquivo JSON");
    }
};

module.exports = { readJson, writeJson };
