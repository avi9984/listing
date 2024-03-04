const { Listing } = require("../models/listing");
const { verifyToken } = require('../services/authServices');


const createListing = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const userType = verification.data.data.userType;
            if (userType === 'vendors' || userType === 'admin') {
                let body = req.body;
                const { listing_name, city, address, price, business_phone } = body
                if (!(listing_name && city && address && price && business_phone)) {
                    return res.status(400).json({ status: false, message: "All fields are required" })
                }
                let files = req.files;
                let imageUrl = [];
                if (files) {
                    for (let file of files) {
                        imageUrl.push(file.filename);
                    }
                }
                const findCount = await Listing.find({}).sort({ listingId: -1 }).limit(1);
                let id;
                if (findCount.length === 0) {
                    id = 1;
                } else {
                    id = parseInt(findCount[0].listingId) + 1;
                }
                const obj = {
                    listingId: id,
                    listing_name,
                    city,
                    address,
                    business_phone,
                    price,
                    ownerId: verification.data.data.userId,
                    ownerName: verification.data.data.name,
                    userType: userType,
                    images: imageUrl
                }
                const saveListing = await Listing.create(obj);
                return res.status(201).json({ status: true, message: "Restorent Listed successfully" })
            } else {
                return res.status(400).json({ status: false, message: "User not authorized to use this api" })
            }
        } else {
            return res.status(401).json({ status: false, message: verification.message })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Server Error" })
    }
}
const getListing = async (req, res) => {
    try {
        const listing = await Listing.find({}, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        if (!listing) {
            return res.status(404).json({ status: false, message: "Listing not found" })
        }
        return res.status(200).json({ status: true, message: "All listing", listing })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Server Error" })
    }
}

const getListById = async (req, res) => {
    try {
        const listingId = req.params.listingId;
        const listing = await Listing.find({ listingId }, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        if (!listing) {
            return res.status(404).json({ status: false, message: "Listing not found" })
        }
        return res.status(200).json({ status: true, message: "All listing", listing })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Server Error" })
    }
}
const verifiedGetAllListing = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const listing = await Listing.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
            if (!listing) {
                return res.status(404).json({ status: false, message: "Listing not found" })
            }
            return res.status(200).json({ status: true, message: "Get all listing", listing })
        } else {
            return res.status(401).json({ status: false, message: verification.message })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Server Error" })
    }
}

const updateListing = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const userType = verification.data.data.userType;
            if (userType === 'admin' || userType === 'vendors') {
                const listingId = req.params.listingId;
                const body = req.body;
                const { listing_name, city, address, price, business_phone } = body
                const existingListing = await Listing.findOne({ listingId: listingId });
                const existingImages = existingListing ? existingListing.images : [];
                let files = req.files;
                let imageUrl = [];
                if (files) {
                    for (let file of files) {
                        imageUrl.push(file.filename);
                    }
                }
                const listingUpdate = await Listing.findOneAndUpdate({ listingId: listingId }, {
                    $set: {
                        listing_name: listing_name ? listing_name : listing_name,
                        city: city ? city : city,
                        address: address ? address : address,
                        price: price ? price : price,
                        business_phone: business_phone ? business_phone : business_phone,
                        images: imageUrl.length > 0 ? imageUrl : existingImages
                    }
                }, { new: true })
                if (!listingUpdate) {
                    return res.status(404).json({ status: false, message: "Listing not found" })
                }
                return res.status(200).json({ status: false, message: "Listing updated successfully", listingUpdate })
            } else {
                return res.status(400).json({ status: false, message: "User not  authorized to perform this action" })
            }
        } else {
            return res.status(401).json({ status: false, message: verification.message })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Server Error" })
    }
}

const deleteListing = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const userType = verification.data.data.userType;
            if (userType === 'admin') {
                const listingId = req.params.listingId;
                const findListing = await Listing.findOneAndDelete({ listingId })
                if (!findListing) {
                    return res.status(404).json({ status: false, message: "Not found" })
                }
                return res.status(200).json({ status: true, message: "List delete successfully" })
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
module.exports = { createListing, getListing, getListById, verifiedGetAllListing, updateListing, deleteListing }