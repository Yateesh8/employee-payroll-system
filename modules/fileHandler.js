const fs = require("fs").promises;

const readEmployees = async () => {
    const data = await fs.readFile("employees.json", "utf-8");
    return JSON.parse(data);
};

const writeEmployees = async (data) => {
    await fs.writeFile("employees.json", JSON.stringify(data, null, 2));
};

module.exports = { readEmployees, writeEmployees };
