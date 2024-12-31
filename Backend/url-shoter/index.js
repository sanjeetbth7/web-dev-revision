import express from "express";
import connectToMongoDB from "./config/db.js";
import urlRouter from "./routes/urlRoute.js"
const PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const dburl = "mongodb://127.0.0.1:27017/urlShoterDB";
connectToMongoDB(dburl);


app.use("/", urlRouter);
// 404 Middleware for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: "Page not found" });
  });

app.listen(PORT, ()=> console.log(`server is running at http://localhost:${PORT}/`));