const path = require('path');
const util = require('util')
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // console.log("hello");
        const path = process.env.IMAGES
        fs.mkdirSync(path, { recursive: true });
        callback(null, path);
    },
    filename: (req, file, callback) => {
        const match = ["image/png", "image/jpeg", "image/jfif"];
        if (match.indexOf(file.mimetype) === -1) {
            var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
            return callback(message, null);
        }
        var filename = file.originalname;
        callback(null, filename);
    }
});

const uploadFiles = multer({ storage: storage }).array("images");
const uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = { uploadFilesMiddleware }
