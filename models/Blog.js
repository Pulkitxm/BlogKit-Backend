const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title:String,
    author:String,
    content:String,
    likes:Number
})

BlogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Blog",BlogSchema)