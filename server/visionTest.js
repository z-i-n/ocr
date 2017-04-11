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
    keyFilename: './keyfile.json'
});

var annotateImageReq =
        {
            'image': {
                'content': base64_encode('../resource/pizza.jpg')
            },
            'features': [
                {
                    'type': 'TEXT_DETECTION',
                    'maxResults': 1000
                }
            ]
        };

// Read the text from an image.
visionClient.annotate(annotateImageReq, function(err, annotations, apiResponse) {
    let anno = apiResponse;
    console.log(JSON.stringify(anno.responses));
});
/*
// Detect faces and the locations of their features in an image.
visionClient.detectFaces('./image.jpg', function(err, faces) {
// faces = [
//   {
//     angles: {pan,tilt,roll},
//     bounds: {
//       head: [{x,y},{x,y},{x,y},{x,y}],
//       face: [{x,y},{x,y},{x,y},{x,y}]
//     },
//     features: {
//       confidence: 34.489909,
//       chin: {
//         center: {x,y,z},
//         left: {x,y,z},
//         right: {x,y,z}
//       },
//       ears: {
//         left: {x,y,z},
//         right: {x,y,z}
//       },
//       eyebrows: {
//         left: {
//           left: {x,y,z},
//           right: {x,y,z},
//           top: {x,y,z}
//         },
//         right: {
//           left: {x,y,z},
//           right: {x,y,z},
//           top: {x,y,z}
//         }
//       },
//       eyes: {
//         left: {
//           bottom: {x,y,z},
//           center: {x,y,z},
//           left: {x,y,z},
//           pupil: {x,y,z},
//           right: {x,y,z},
//           top: {x,y,z}
//         },
//         right: {
//           bottom: {x,y,z},
//           center: {x,y,z},
//           left: {x,y,z},
//           pupil: {x,y,z},
//           right: {x,y,z},
//           top: {x,y,z}
//         }
//       },
//       forehead: {x,y,z},
//       lips: {
//         bottom: {x,y,z},
//         top: {x,y,z}
//       },
//       mouth: {
//         center: {x,y,z},
//         left: {x,y,z},
//         right: {x,y,z}
//       },
//       nose: {
//         bottom: {
//           center: {x,y,z},
//           left: {x,y,z},
//           right: {x,y,z}
//         },
//         tip: {x,y,z},
//         top: {x,y,z}
//       }
//     },
//     confidence: 56.748849,
//     blurry: false,
//     dark: false,
//     happy: false,
//     hat: false,
//     mad: false,
//     sad: false,
//     surprised: false
//   }
// ]
});*/
