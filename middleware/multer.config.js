const multer = require("multer");
const md5 = require('md5');

// Mapping des extensions
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "img");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split("").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, md5(name) + Date.now() + "." + extension);
  },
});
// storage est la destinatiob du fichier limits à 500ko l'image, le nombre caractère et la dimension de l'image
module.exports = multer({ storage: storage, limits:{fileSize: 512000 ,fieldNameSize: 200, fieldSize: 1280 * 1000} }).single("image");
