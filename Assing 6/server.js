
const express = require("express");
const app = express();

app.use(express.json());

let students = [
    {
        id: 101,
        name: "Sudarshan",
        marks: 88
    },
    {
        id: 102,
        name: "Nachiket",
        marks: 76
    },
    {
        id: 103,
        name: "Gitesh",
        marks: 92
    }
];

// GET - Display all students
app.get("/students", (req, res) => {
    res.json(students);
});

// POST - Add a new student
app.post("/students", (req, res) => {
    const newStudent = {
        id: students.length > 0
            ? Math.max(...students.map(s => s.id)) + 1
            : 101,
        name: req.body.name,
        marks: req.body.marks
    };

    students.push(newStudent);

    res.status(201).json({
        message: "New student added successfully",
        student: newStudent
    });
});

// PUT - Update student details
app.put("/students/:id", (req, res) => {
    const studentId = Number(req.params.id);

    const foundStudent = students.find(
        student => student.id === studentId
    );

    if (!foundStudent) {
        return res.status(404).json({
            message: "Student record not found"
        });
    }

    foundStudent.name = req.body.name;
    foundStudent.marks = req.body.marks;

    res.json({
        message: "Student details updated",
        student: foundStudent
    });
});

// DELETE - Remove a student
app.delete("/students/:id", (req, res) => {
    const studentId = Number(req.params.id);

    const initialLength = students.length;

    students = students.filter(
        student => student.id !== studentId
    );

    if (students.length === initialLength) {
        return res.status(404).json({
            message: "Student record not found"
        });
    }

    res.json({
        message: "Student deleted successfully"
    });
});

// Start the server
app.listen(3000, () => {
    console.log("Student API is running at port 3000");
});
