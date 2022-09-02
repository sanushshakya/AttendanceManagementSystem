const multer = require("multer");

const storage = multer.diskStorage({
  destination: (res, file, cb) => {
    cb(null, "public/static/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = { upload: multer({ storage }) };
