const { Listing } = require('../models/listing');
const { Review } = require('../models/review');
const { verifyToken } = require('../services/authServices');


const createReview = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const userType = verification.data.data.userType;
            if (userType === 'user' || userType === 'admin') {
                const body = req.body;
                if (!(body.review && body.listingId)) {
                    return res.status(400).json({ status: false, message: `Please provide review and listing id` })
                }
                const findListing = await Listing.findOne({ listingId: body.listingId });
                if (!findListing) {
                    return res.status(404).json({ status: false, message: "Listing not found" })
                }

                const findCount = await Review.find({}).sort({ reviewId: -1 }).limit(1);
                let id;
                if (findCount.length === 0) {
                    id = 1;
                } else {
                    id = parseInt(findCount[0].reviewId) + 1;
                }
                const obj = {
                    reviewId: id,
                    review: body.review,
                    rating: body.rating,
                    listingId: body.listingId,
                    userId: verification.data.data.userId,
                }
                const saveReview = await Review.create(obj);
                return res.status(201).json({ status: true, message: "Review done" })
            } else {
                return res.status(400).json({ status: false, message: "Not authorized the vendor" })
            }
        } else {
            return res.status(401).json({ status: false, message: verification.message })
        }
    } catch (error) {
        console.log(error);
    }
}

const getAllReviews = async (req, res) => {
    try {
        const review = await Review.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
        if (!review) {
            return res.status(404).json({ status: false, message: "Review not found" })
        }
        return res.status(200).json({ status: true, message: "Get all reviews", review })
    } catch (error) {
        console.log(error);
    }
}

const getReviewById = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const review = await Review.findOne({ reviewId }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
        if (!review) {
            return res.status(404).json({ status: false, message: "Review not found" })
        }
        return res.status(200).json({ status: true, message: "Get all reviews", review })
    } catch (error) {
        console.log(error);
    }
}
const updateReview = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const userType = verification.data.data.userType;
            const userId = verification.data.data.userId;
            const reviewId = req.params.reviewId;
            const body = req.body;
            const { review, responce, rating } = body
            if (userType === 'admin' || userType === 'user') {
                const findReview = await Review.findOneAndUpdate({ reviewId: reviewId, userId: userId }, {
                    $set: {
                        review: body.review || review,
                        rating: body.rating || rating,
                    }
                }, { new: true })
                if (!findReview) {
                    return res.status(404).json({ status: false, message: "Review not found" })
                }
                return res.status(200).json({ status: true, message: "Review updated successfully" })
            } else {
                const findReview = await Review.findOneAndUpdate({ reviewId: reviewId }, {
                    $set: {
                        responce: req.body.responce,
                        vendorName: verification.data.data.name
                    }
                }, { new: true })
                if (!findReview) {
                    return res.status(404).json({ status: false, message: "Review not found" })
                }
                return res.status(200).json({ status: true, message: "Vender answer updated successfully" })
            }
        } else {
            return res.status(401).json({ status: false, message: verification.message })
        }
    } catch (error) {
        console.log(error);
    }
}

const deleteReview = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const userType = verification.data.data.userType;
            const reviewId = req.params.reviewId;
            if (userType === 'admin' || userType === 'user') {
                const findReview = await Review.findOneAndDelete({ reviewId });
                if (!findReview) {
                    return res.status(404).json({ status: false, message: "Review not found" })
                }
                return res.status(200).json({ status: true, message: "Review deleted successfully" })
            } else {
                return res.status(400).json({ status: false, message: "Not authorized to perform this action" })
            }
        } else {
            return res.status(401).json({ status: false, message: verification.message })
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports = { createReview, getAllReviews, getReviewById, updateReview, deleteReview }