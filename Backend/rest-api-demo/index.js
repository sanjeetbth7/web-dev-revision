import express from "express";
import fs from 'fs';

const app = express();
const PORT = 3000;

import users from "./MOCK_DATA.json" assert { type: "json" };

// Middleware - Plugin
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Add this to parse JSON request bodies

app.get("/", (req, res) => {
    res.send(`Hello, ${req.query.user}!`);
})

// GET request
app.get("/api/users", (req, res) => {
    res.send(users);
})

app.get("/api/users/:id", (req, res) => {  // id -> variable | dynamic
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    res.json(user);
})

// POST request
app.post("/api/users", (req, res) => {
    let newUser = req.body;
    newUser = { id: users.length + 1, ...newUser };
    users.push(newUser);

    // Write updated users array to the file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err)
            return res.status(500).json({ error: "Failed to add new user." });
        res.json({ message: "New user added!", id: newUser.id });
    });
});

// PATCH request
app.patch("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);

    // Find the user by id
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    // Update the user object with the new data
    users[index] = { id, ...req.body };

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to update user." });
        }
        res.json({ message: `User id ${id} updated successfully`, user: users[index] });
    });
});

// DELETE request
app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    // Remove the user from the array
    users.splice(index, 1);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to delete user" });
        }
        res.json({ message: `User id ${id} is deleted` });
    });
});

app.listen(PORT, () => console.log(`server started at http://localhost:${PORT}`))
