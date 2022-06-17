const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  bookName: {
    type: String,
  },
  bookPrice: {
    type: Number,
  },
  bookId:{
      type:Number,
      unique:true,
      required:true
  },
  authorName: {
    type: String
  },
  createdBy: {
    type: String,

  },
  createdAt: {
    type: Date,
    dafault: Date.now(),
  },
});
module.exports = Book = mongoose.model("book", bookSchema);
