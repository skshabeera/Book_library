const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bookModel = require("../../models/Book");
const auth = require("../../middleware/auth");

/** 
 @api {post} /api/book Create the single book
 * @apiName post books
 * @apiGroup books
 *
 * @apiSuccess {String} bookName get the bookName
 * @apiSuccess {String} bookPrice get the bookPrice
 * @apiSuccess {Number} bookId get the bookId
 * @apiSuccess {String} CreatedBy get the CreatedBy
 * @apiSuccess {String} authorName get the authorName
 * @apiSuccess {Number} CreatedAt get the date of CreatedAt
 * 
 * @apiError {String} Book book  already exist
; */
router.post(
  "/",
  [
    check("bookName", "bookName is required").not().isEmpty(),
    check("bookPrice", "bookPrice is required").isLength({ min: 3, max: 6 }),
    check("bookId", "bookId is required").isLength({ min: 1, max: 3 }),
    check("authorName", "authorName is required").not().isEmpty(),
    check("createdBy", "createdBy is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let book = new bookModel(req.body);
      const bookCreated = await book.save();
      return res.status(400).send(bookCreated);
    } catch (err) {
      console.error(err.message);
    }
  }
);

/** 
 @api {get} /api/book/:authorid get the author by id
 * @apiName GetAuthorById
 * @apiGroup books
 *
 * @apiSuccess {String} Bookname get the Bookname
 * @apiSuccess {Number} BookId get the BookId
 * @apiSuccess {Number} Bookprice get the Bookprice
 * @apiSuccess {String} Authorname get the Authorname
 * @apiSuccess {String} CreatedBy get the CreatedBy
 * @apiSuccess {Number} CreatedAt get the date of CreatedAt
 * 
 * @apiError {String} Author author Not Found
; */
router.get("/:authorid", async (req, res) => {
  try {
    const { authorid } = req.params;
    const authorNameData = await bookModel.findOne({ authorName: authorid });
    if (!authorNameData) {
      res.status(404).send();
      return res.send("anthor not found");
    } else {
      res.send(authorNameData);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/** 
 @api {put} /api/book/:id Edit the book by id
 * @apiName EditbookById
 * @apiGroup books
 *
 * @apiSuccess {String} Bookname get the Bookname
 * @apiSuccess {Number} BookId get the BookId
 * @apiSuccess {Number} Bookprice get the Bookprice
 * @apiSuccess {String} Authorname get the Authorname
 * @apiSuccess {String} CreatedBy get the CreatedBy
 * @apiSuccess {Number} CreatedAt get the date of CreatedAt
 * 
 * @apiError {String} Book book Not Found
; */
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBookData = await bookModel.findByIdAndUpdate(id, req.body);
    res.send(updatedBookData);
  } catch (err) {
    res.send(err.message);
  }
});

/** 
 @api {delete} /api/book/:id delete the book by id
 * @apiName DeletebookById
 * @apiGroup books
 *
 * @apiSuccess {String} Bookname get the Bookname
 * @apiSuccess {Number} BookId get the BookId
 * @apiSuccess {Number} Bookprice get the Bookprice
 * @apiSuccess {String} Authorname get the Authorname
 * @apiSuccess {String} CreatedBy get the CreatedBy
 * @apiSuccess {Number} CreatedAt get the date of CreatedAt
 * 
 * @apiError {String} Book book Not Found
; */
router.delete("/:id", async (req, res) => {
  try {
    const deleteBookData = await bookModel.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(404).send();
    }
    res.send(deleteBookData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/** 
 @api {get} /api/book get the books by pagination
 * @apiName get books
 * @apiGroup books
 *
 * @apiSuccess {String} Bookname get the Bookname
 * @apiSuccess {Number} BookId get the BookId
 * @apiSuccess {Number} Bookprice get the Bookprice
 * @apiSuccess {String} Authorname get the Authorname
 * @apiSuccess {String} CreatedBy get the CreatedBy
 * @apiSuccess {Number} CreatedAt get the date of CreatedAt
 * 
 * @apiError {String} Book book Not Found
; */
router.get("/", async (req, res) => {
  try {
    let { page, size } = req.query;
    if (!page) {
      page = 1;
    }
    if (!size) {
      size = 10;
    }
    const limit = parseInt(size);
    const skip = (page - 1) * size;
    const users = await Book.find().limit(limit).skip(skip);
    res.send(users);
  } catch (err) {
    res.status(500).send(error.message);
  }
});
module.exports = router;
