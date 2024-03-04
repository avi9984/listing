const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewId: { type: Number },
    userId: { type: Number },
    listingId: { type: Number },
    review: { type: String },
    responce: { type: String },
    vendorName: { type: String },
    rating: { type: Number, default: 0 },

}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);
module.exports = { Review };