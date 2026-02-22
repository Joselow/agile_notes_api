import express from "express";
import dotenv from "dotenv";
import notesRoutes from "./routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/v1", notesRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello World!", success: true, code: 200 });
}); 

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});