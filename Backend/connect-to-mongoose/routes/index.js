import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
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

export default router;