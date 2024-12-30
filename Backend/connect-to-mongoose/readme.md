### Mongoose Notes for Beginners

Mongoose is a **Node.js library** that makes it easy to interact with MongoDB databases by using **schemas and models**. It helps manage data with built-in validation, queries, and hooks.

---

### **1. Installing Mongoose**
Use npm to install Mongoose:
```bash
npm install mongoose
```

---

### **2. Connecting to MongoDB**
Mongoose connects to your MongoDB database using the `connect` method.
```javascript
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Connection failed", error));
```

---

### **3. Defining a Schema**
A schema is a structure that defines how data will look in the database.
```javascript
const mongoose = require('mongoose');

// Create a schema
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, default: 18 },
    isAdmin: { type: Boolean, default: false }
});
```

---

### **4. Creating a Model**
A model is a wrapper for interacting with the database based on the schema.
```javascript
// Create a model
const User = mongoose.model("User", userSchema);
```

---

### **5. Adding Data (Create)**
You can save data using the `create` method or a new instance of the model.
```javascript
// Using create
User.create({
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    age: 25
})
.then(user => console.log("User added:", user))
.catch(error => console.error("Error adding user:", error));
```

---

### **6. Fetching Data (Read)**
To fetch data, use methods like `find` or `findById`.
```javascript
// Fetch all users
User.find({})
    .then(users => console.log("Users:", users))
    .catch(error => console.error("Error fetching users:", error));

// Fetch a single user by ID
User.findById("64a9f835d6c56b45b9a2f123")
    .then(user => console.log("User:", user))
    .catch(error => console.error("Error fetching user:", error));
```

---

### **7. Updating Data**
Use `findByIdAndUpdate` or `updateOne` to update data.
```javascript
// Update a user
User.findByIdAndUpdate(
    "64a9f835d6c56b45b9a2f123",
    { age: 30 },
    { new: true } // Return updated document
)
.then(updatedUser => console.log("Updated user:", updatedUser))
.catch(error => console.error("Error updating user:", error));
```

---

### **8. Deleting Data**
To delete data, use methods like `findByIdAndDelete` or `deleteOne`.
```javascript
// Delete a user by ID
User.findByIdAndDelete("64a9f835d6c56b45b9a2f123")
    .then(deletedUser => console.log("Deleted user:", deletedUser))
    .catch(error => console.error("Error deleting user:", error));
```

---

### **9. Adding Validation**
You can add validation rules in your schema to ensure data integrity.
```javascript
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { 
        type: Number, 
        min: 18, // Minimum age is 18
        max: 60  // Maximum age is 60
    }
});
```

---

### **10. Middleware (Hooks)**
Mongoose allows you to run functions before or after certain operations using middleware.
```javascript
userSchema.pre("save", function(next) {
    console.log("A new user is about to be saved:", this);
    next();
});
```

---

### **11. Popular Query Methods**
| Method                   | Description                          |
|--------------------------|--------------------------------------|
| `find()`                 | Fetch multiple documents            |
| `findById(id)`           | Fetch a single document by ID       |
| `create(data)`           | Add a new document                  |
| `findByIdAndUpdate(id, data)` | Update a document by ID           |
| `findByIdAndDelete(id)`  | Delete a document by ID             |

---

### Example: Complete CRUD API

Here’s a full example of a CRUD API using Mongoose:

```javascript
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(error => console.error("Connection failed", error));

// Define schema and model
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, default: 18 }
});
const User = mongoose.model("User", userSchema);

// Routes
// Create
app.post("/api/users", async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

// Read
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

// Update
app.patch("/api/users/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
});

// Delete
app.delete("/api/users/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
```
- **Mongoose** is a higher-level abstraction over the **MongoDB driver**, offering many features like schemas, validation, modeling, population, and more. It's preferred for larger, structured applications where you want a cleaner, easier-to-maintain codebase. On the other hand, the MongoDB driver offers more flexibility and control but requires more effort to manage tasks like data validation, structure, and query building