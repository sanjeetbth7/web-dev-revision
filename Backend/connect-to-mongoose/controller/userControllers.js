
import { User } from "../model/user.js";

export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const getUser = async (req, res) => {
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
}

export const deleteUser = async (req, res) => {
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
}

export const createUser = async (req, res) => {
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
}

export const updateUser = async (req, res) => {
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
}