const express = require("express");
const fileHandler = require("./modules/fileHandler");
const methodOverride = require("method-override");

const app = express();

app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");


app.get("/", async (req, res) => {
    const employees = await fileHandler.readEmployees();
    res.render("index", { employees });
});


app.get("/add", (req, res) => {
    res.render("add");
});


app.post("/add", async (req, res) => {
    const employees = await fileHandler.readEmployees();

    const newEmployee = {
        id: Date.now(),
        name: req.body.name,
        gender: req.body.gender,
        department: req.body.department,
        salary: req.body.salary,
        startDate: req.body.startDate,
        profileImage: req.body.profileImage
    };

    employees.push(newEmployee);
    await fileHandler.writeEmployees(employees);

    res.redirect("/");
});


app.get("/edit/:id", async (req, res) => {
    const id = Number(req.params.id);
    const employees = await fileHandler.readEmployees();

    const employee = employees.find(emp => emp.id === id);
    if (!employee) return res.send("Employee not found");

    res.render("edit", { employee });
});


app.patch("/edit/:id", async (req, res) => {
    const id = Number(req.params.id);
    const employees = await fileHandler.readEmployees();

    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) return res.send("Employee not found");

    employees[index] = {
        id,
        ...req.body
    };

    await fileHandler.writeEmployees(employees);
    res.redirect("/");
});


app.delete("/delete/:id", async (req, res) => {
    const id = Number(req.params.id);
    let employees = await fileHandler.readEmployees();

    employees = employees.filter(emp => emp.id !== id);
    await fileHandler.writeEmployees(employees);

    res.redirect("/");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port:", PORT);
});