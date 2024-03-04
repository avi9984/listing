const express = require('express');
const router = express.Router();
const { uploadFilesMiddleware } = require('../middlewares/fileUpload');
const { createListing, getListing, getListById, verifiedGetAllListing, updateListing, deleteListing } = require('../controllers/listing');


router.post('/createListing', uploadFilesMiddleware, createListing);
router.get('/getAllListing', getListing);
router.get('/getListById/:listingId', getListById);
router.get('/verifiedGetAllListing', verifiedGetAllListing);
router.put('/update/:listingId', uploadFilesMiddleware, updateListing);
router.delete('/delete/:listingId', deleteListing);



module.exports = router;