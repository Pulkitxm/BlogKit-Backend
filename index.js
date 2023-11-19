const express = require("express")
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const blogsRouter = require('./controllers/blogs')

app.use(bodyParser.json());
app.use(cors());
app.use('/', blogsRouter)

main()
    .then(()=>{
        console.log("connected to mongo");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://pulkit:root@cluster0.autemiz.mongodb.net/?retryWrites=true&w=majority"
  );
}

const port = 3001
app.listen(port,()=>{
    console.log(`app is istening at port ${port}`);
})