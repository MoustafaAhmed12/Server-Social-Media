require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Port Number
const PORT = process.env.PORT || 3005;

// app.listen
const start = (port) => {
  try {
    app.listen(port, () => {
      console.log(`API is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};
start(PORT);

// mongoose.connection.once("open", () => {
//   start(PORT);
// });
