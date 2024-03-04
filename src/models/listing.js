const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    listingId: { type: Number },
    listing_name: { type: String, required: true, trim: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    business_phone: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: Array, required: true },
    ownerId: { type: Number },
    ownerName: { type: String },
    userType: { type: String }
}, { timestamps: true })

const Listing = mongoose.model("Listing", listingSchema);
module.exports = { Listing }; 