const express = require('express');
const router = express.Router();
const { createReview, getAllReviews, getReviewById, updateReview, deleteReview } = require('../controllers/review');

router.post('/createReview', createReview);
router.get('/getAllReviews', getAllReviews);
router.get('/getReviewById/:reviewId', getReviewById);
router.put('/update/:reviewId', updateReview);
router.delete('/delete/:reviewId', deleteReview);



module.exports = router

