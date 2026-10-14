
const express = require("express");
const app = express();

app.use(express.json());

let students = [
    { id: 1, name: "Pranav", marks: 85 },
    { id: 2, name: "Sameer", marks: 78 },
    { id: 3, name: "Nachiket", marks: 91 }
];

// GET - Get all students
app.get("/students", (req, res) => {
    res.json(students);
});

// POST - Add a student
app.post("/students", (req, res) => {
    const student = {
        id: students.length
            ? Math.max(...students.map(s => s.id)) + 1
            : 1,
        name: req.body.name,
        marks: req.body.marks
    };

    students.push(student);
    res.send("Student added successfully");
});

// PUT - Update a student
app.put("/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).send("Student not found");
    }

    student.name = req.body.name;
    student.marks = req.body.marks;

    res.send("Student updated successfully");
});

// DELETE - Delete a student
app.delete("/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const oldLength = students.length;

    students = students.filter(s => s.id !== id);

    if (students.length === oldLength) {
        return res.status(404).send("Student not found");
    }

    res.send("Student deleted successfully");
});

// Start the server
app.listen(3000, () => {
    console.log("Assignment 7 API running on port 3000");
});
