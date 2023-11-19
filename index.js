const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
main();

const blogsRouter = express.Router();

const BlogSchema = new mongoose.Schema({
  title: String,
  author: String,
  content: String,
  likes: Number,
});

BlogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
  },
});

const Blog = mongoose.model("Blog", BlogSchema);

blogsRouter.get("/", (req, res) => {
  res.send("It is working");
});

blogsRouter.get("/blogs", async (req, res) => {
  await Blog.find({}).then((blogs) => {
    res.status(202).send(blogs);
  });
});

blogsRouter.post("/blogs", async (req, res) => {
  const newBlog = new Blog({
    title: req.body.title,
    author: req.body.author,
    content: req.body.content,
    likes: req.body.likes,
  });
  await newBlog.save().then((blog) => {
    res.status(202).send(`new Blog is added with id ${newBlog._id}`);
  });
});

blogsRouter.get("/blog/:id", async (req, res) => {
  await Blog.findById(req.params.id).then((blog) => {
    res.status(202).send(blog);
  });
});

blogsRouter.put("/blog/:id", async (req, res) => {
  //get body for blog
  await Blog.findByIdAndUpdate(
    req.params.id,
    { content: req.body.content },
    { new: true }
  ).then(() => {
    res.status(202).send(`Blog with id ${req.params.id} is updated`);
  });
});

blogsRouter.patch("/blog/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    // Fetch the current blog by ID
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).send(`Blog with id ${blogId} not found`);
    }
    // Increment the likes count
    blog.likes += 1;
    // Save the updated blog
    await blog.save();
    res.status(202).send(`Blog with id ${blogId} is updated`);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).send("Internal Server Error");
  }
});

blogsRouter.delete("/blog/:id", async (req, res) => {
  //get body for blog
  await Blog.findByIdAndDelete(req.params.id).then(() => {
    res.status(202).send(`Blog with id ${req.params.id} is deleted`);
  });
});

blogsRouter.get("/:author/blogs", async (req, res) => {
  await Blog.find({ author: req.params.author }).then((blogs) => {
    res.status(202).send(blogs);
  });
});

blogsRouter.delete("/:author/blogs", async (req, res) => {
  await Blog.deleteMany({ author: req.params.author }).then((blogs) => {
    res.status(202).send(`Blogs with author ${req.params.id} are deleted`);
  });
});

app.use("/", blogsRouter);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
