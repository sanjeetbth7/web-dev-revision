import express from "express";
import mongoose from "mongoose";

const PORT = 3000;
const app = express();

// Middleware - Plugin // predefinded middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Add this to parse JSON request bodies

mongoose.connect("mongodb://127.0.0.1:27017/tempDB").then(()=> console.log("connected to Database...")).catch((err)=> console.log("mongodb connection error\n",err));


const userSchema = mongoose.Schema({
    first_name : {
        type : String,
        required : true,
    },
    last_name : {
        type : String,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    gender : {
        type : String,
        required : true,
    },
    job : {
        type : String,
    }
}, {  timestamps : true });

const User = mongoose.model("users", userSchema);

app.get("/", async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find({});
        const page = `<ul>${users.map((user)=> `<li>${user.first_name} ${user.last_name} - ${user.email}</li>`).join("")}</ul>`;
        

        res.status(200).send(page);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.get("/api/users", async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.get("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user)  return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);

        // Handle invalid ID format (e.g., non-ObjectId) or other errors
        if (error.name === "CastError" && error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// DELETE a user
app.delete("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Return success message and deleted user data
        res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
        console.error(error);

        // Handle invalid ID format errors thrown by Mongoose
        if (error.name === "CastError") {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


// CREATE a user
app.post("/api/users", async (req, res) => {
    try {
        const { first_name, last_name, email, gender, job } = req.body;

        // Check if all required fields are provided
        if (!first_name || !last_name || !email || !gender || !job) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Create a new user
        const newUser = { first_name, last_name, email, gender, job };
        const result = await User.create(newUser);
        res.status(201).json({ message: "Created successfully", result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// PATCH (Update) a user
app.patch("/api/users/:id", async (req, res) => {
    try {
        // Update the user with the provided fields
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, // Fields to update
            { new: true, runValidators: true } // Return updated user and validate data
        );

        // Check if the user exists
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the updated user data
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error(error);

        // Handle invalid ID format errors
        if (error.name === "CastError") {
            return res.status(404).json({ message: "User not found" });
        }

        // Handle validation errors or other issues
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});



app.listen(PORT, ()=> console.log(`server started at http://localhost:${PORT}`));