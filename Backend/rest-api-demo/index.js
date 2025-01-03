import express from "express";
import fs from 'fs';

const app = express();
const PORT = 3000;

import users from "./MOCK_DATA.json" assert { type: "json" };

// Middleware - Plugin // predefinded middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Add this to parse JSON request bodies


// First custom middleware: Logs a message and passes control to the next middleware
app.use((req, res, next) => {
    console.log("Hello from Middleware 1"); 
    next(); // Passes control to the next middleware
});

// Second custom middleware: Logs another message and passes control to the next middleware
app.use((req, res, next) => {
    console.log("Hello from Middleware 2"); 
    next(); // Passes control to the next middleware
});


app.get("/", (req, res) => {
    res.send(`Hello, ${req.query.user}!`);
})

// GET request
app.get("/api/users", (req, res) => {

    console.log(req.headers);// print client side headers
    res.setHeader("X-My-Name","Sanjeet Kumar"); // added X as suffix on custom headers, it is optional, it is for others so that they can segrigate from custom headers and built-in headers
    res.send(users);
})

app.get("/api/users/:id", (req, res) => {  // id -> variable | dynamic
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    if(!user) return res.status(404).json({error : "User not found.."})
    res.json(user);
})

// POST request
app.post("/api/users", (req, res) => {
    let newUser = req.body;

    if(!newUser || !newUser.first_name || !newUser.last_name || !newUser.email || !newUser.gender || !newUser.job) return res.status(400).json({message : "All fields are required...."});
    newUser = { id: users.length + 1, ...newUser };
    users.push(newUser);

    // Write updated users array to the file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err)
            return res.status(500).json({ error: "Failed to add new user." });
        res.status(201).json({ message: "New user added!", id: newUser.id });
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
