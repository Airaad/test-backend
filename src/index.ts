import express from "express";
import authRouter from "./routes/auth.route";
import dotenv from "dotenv";

dotenv.config();

const port = 8080;
const app = express();

app.use(express.json());

//auth-routes
app.use("/api/v1/auth", authRouter);

app.listen(port, () => {
  console.log("listening on port", port);
});
