import express from "express";
import renderer from "./helpers/renderer";

const app = express();
const PORT = 4000;

app.use(express.static("public"));

app.get("*", (req, res) => {
  res.send(renderer(req));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
