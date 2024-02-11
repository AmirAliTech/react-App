const express = require("express");
const app = express();
const port = 3001;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));

const generateToken = (userId) => {
  var secretKey = "yourSecretKey"; // Replace with a secure secret key
  const token = jwt.sign({ userId }, secretKey, { expiresIn: "1h" });
  return token;
};



const verifyTokenMiddleware = (req, res, next) => {
  try {
    const authtoken = req.header("Authorization");
    const secretKey = "yourSecretKey";

    if (!authtoken) {
      return res.status(401).send("Unauthorized: Token not provided");
    }

    const token = authtoken.replace("Bearer ", "");
    const decodedToken = jwt.verify(token, secretKey);

    req.decodedToken = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).send("Unauthorized: Invalid token");
  }
};

mongoose
  .connect("mongodb://127.0.0.1:27017/user", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

const personSchema = mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  message: String,
  nfile: String,
  date: { type: Date, default: Date.now },
});

const PersonModel = mongoose.model("Person", personSchema);

const signinSchema = mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  message: String,
  date: { type: Date, default: Date.now },
});

const SigninModel = mongoose.model("Signin", signinSchema);

app.post("/enterdata", upload.single("nfile"), async (req, res) => {
  try {
    const data = new PersonModel({
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      message: req.body.message,
      nfile: req.file.path,
    });
    await data.save();
    console.log(req.file);
    res.status(201).send("Data saved successfully");
  } catch (error) {
    console.error("Error saving data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/findAll", verifyTokenMiddleware, async (req, res) => {
  try {
    const getdata = await PersonModel.find().sort({ _id: -1 }).exec();
    res.status(200).json(getdata);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/findOne/:id", verifyTokenMiddleware, async (req, res) => {
  try {
    const getonedata = await PersonModel.findById(req.params.id);
    res.status(200).send(getonedata);
  } catch (error) {
    console.log("data not found", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/itemremove/:id", async (req, res) => {
  try {
    const removeonedata = await PersonModel.findByIdAndDelete(req.params.id);
    if (!removeonedata) return res.status(404).send("No data");
    const filePath = removeonedata.nfile;
    if (filePath) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    }
    res.status(200).send("Data deleted successfully");
  } catch (error) {
    console.log("Error deleting data", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/updatedata/:id", verifyTokenMiddleware, upload.single("nfile"), async (req, res) => {
  try {
    let updateData;

    if (req.file) {
      updateData = await PersonModel.findByIdAndUpdate(
        req.params.id,
        { nfile: req.file.path },
        {
          $set: req.body,
        },
        { new: true, useFindAndModify: false }
      );

      const oldFilePath =
        updateData && typeof updateData.nfile === "string" && updateData.nfile;

      if (oldFilePath) {
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Error deleting old file:", err);
          }
        });
      }
    } else {
      updateData = await PersonModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true, useFindAndModify: false }
      );
    }

    if (updateData) {
      res.status(200).send("Data updated successfully");
    } else {
      res.status(404).send("Data not found or could not be updated");
    }
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/signin", async (req, res) => {
  try {
    const data = new SigninModel(req.body);
    await data.save();
    const userId = "world123";
    const token = generateToken(userId);
    res.status(201).json({ message: "Data saved successfully", token });
  } catch (error) {
    console.error("Error saving data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/gettoken", verifyTokenMiddleware, async (req, res) => {
  try {
    res.status(200).send("Token verification initiated.");
  } catch (error) {
    console.error("Error in /gettoken:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
