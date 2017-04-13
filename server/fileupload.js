const fileUpload = require('express-fileupload');
const vision = require('./vision');
const fs = require('fs');

module.exports = function(app) {
  app.use(fileUpload());
  app.post('/fileupload', function(req, res) {
    if (!req.files)
      return res.status(400).json({"errno":-100, "code": "ERROR", "message": "No files were uploaded."});

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let ocrImage = req.files.ocr_image;
    let fileName = ocrImage.name;
    let filePath = './dist/resource/';

    // Use the mv() method to place the file somewhere on your server
    ocrImage.mv(filePath + fileName, function(err) {
      if (err) {
        return res.status(500).json({"errno":-200, "code": "ERROR", "message": err.message});
      } else {
        vision(filePath, fileName)
          .then(
            ()=>res.json({"errno":0,"code":"SUCCESS", "message": "File uploaded!", "fileName": fileName}),
            err=>res.json({"errno":-300, "code": "ERROR", "message": err.message})
          )
          .catch(err => {
            res.json({"errno":-400,"code":"ERROR", "message": err.message});
          });
      }
    });
  });
};
/*
if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath);
}
.replace(/\.[a-zA-Z0-9]+$/, '')
*/
