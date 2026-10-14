
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let students;

async function startServer() {
    try {
        await client.connect();

        console.log("MongoDB connected successfully");

        const db = client.db("college");
        students = db.collection("students");

        // GET - Display all students
        app.get("/students", async (req, res) => {
            try {
                const data = await students.find().toArray();
                res.json(data);
            } catch (error) {
                res.status(500).send("Error fetching students");
            }
        });

        // POST - Add a student
        app.post("/students", async (req, res) => {
            try {
                const lastStudent = await students
                    .find()
                    .sort({ id: -1 })
                    .limit(1)
                    .toArray();

                const newStudent = {
                    id: lastStudent.length
                        ? lastStudent[0].id + 1
                        : 1,
                    name: req.body.name,
                    marks: req.body.marks
                };

                await students.insertOne(newStudent);

                res.status(201).json({
                    message: "Student added successfully",
                    student: newStudent
                });
            } catch (error) {
                res.status(500).send("Error adding student");
            }
        });

        // PUT - Update a student
        app.put("/students/:id", async (req, res) => {
            try {
                const id = Number(req.params.id);

                const result = await students.updateOne(
                    { id: id },
                    {
                        $set: {
                            name: req.body.name,
                            marks: req.body.marks
                        }
                    }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).send("Student not found");
                }

                res.send("Student updated successfully");
            } catch (error) {
                res.status(500).send("Error updating student");
            }
        });

        // DELETE - Remove a student
        app.delete("/students/:id", async (req, res) => {
            try {
                const id = Number(req.params.id);

                const result = await students.deleteOne({ id: id });

                if (result.deletedCount === 0) {
                    return res.status(404).send("Student not found");
                }

                res.send("Student deleted successfully");
            } catch (error) {
                res.status(500).send("Error deleting student");
            }
        });

        app.listen(3000, () => {
            console.log("MongoDB Student API running on port 3000");
        });

    } catch (error) {
        console.error("Unable to connect to MongoDB:", error.message);
    }
}

startServer();
