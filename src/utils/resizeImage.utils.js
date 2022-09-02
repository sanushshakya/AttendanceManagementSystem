const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

exports.resizeImage = async (image) => {
  await sharp(image.path)
    .resize(200, 200)
    .jpeg({ quality: 90 })
    .toFile(path.resolve(image.destination, "resized", image.filename));

  fs.unlinkSync(image.path);
};
