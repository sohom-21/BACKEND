import express from "express";
import dotenv from "dotenv";
import Db from "./db/db.js";
import useRrouter from "./routes/Ro_user.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use('/api/user',useRrouter);
Db();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})