// Authenticating on a per-API-basis. You don't need to do this if you auth on a
// global basis (see Authentication section above).
var vision = require('@google-cloud/vision');
var fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

var visionClient = vision({
  projectId: 'api-project-351130828851',
  keyFilename: './server/keyfile.json'
});

module.exports = function(path, filename) {
  var promise = new Promise(function(resolve, reject) {
    var annotateImageReq = {
      'image': {
        'content': base64_encode(path + filename)
      },
      'features': [{
        'type': 'TEXT_DETECTION',
        'maxResults': 1000
      }]
    };

    // Read the text from an image.
    visionClient.annotate(annotateImageReq, (err, annotations, apiResponse) => {
      if (err) {
        reject( err );
      } else {
        let anno = apiResponse;
        fs.writeFile(path + filename.replace(/\.[a-zA-Z0-9]+$/, '.json'), JSON.stringify({'responses': anno.responses}), 'utf8', (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
  return promise;
};
