
const fs = require('fs');
const path = require('path')

module.exports = function(fileName) {

  let filePath = './dist/resource/';
  let promise = new Promise(function(resolve, reject) {
fs.readFile
    if () {
      fs.readFile(filePath + fileName,
        'utf8',
        (err, files) => {
          if (err) {
            reject(err);
          } else {
            let list = [];
            files.filter(
              file => (/\.(gif|jpg|jpeg|tiff|png)$/i).test( path.extname( path.join(srcpath, file) ) )
            ).map((item, index)=>{
              list.push({
                name: item.replace(/\.[a-zA-Z0-9]+$/, ''),
                image: item
              });
            });

            resolve(list);
          }
        }
      );
    } else {

    }


  });
  return promise;
};
//directory list
//file => fs.statSync(path.join(srcpath, file)).isDirectory()
