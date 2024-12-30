import express from "express";
import userRouter from "./routes/userRoutes.js";
import mainRouter from "./routes/index.js";
import { connectMongoDB } from "./config/db.js";

const PORT = 3000;
const app = express();
const dburl = "mongodb://127.0.0.1:27017/tempDB";



//Connect to mongodb database
connectMongoDB(dburl);

// Middleware - Plugin // predefinded middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Add this to parse JSON request bodies

app.use("/", mainRouter)
app.use("/api/users", userRouter)


app.listen(PORT, ()=> console.log(`server started at http://localhost:${PORT}`));