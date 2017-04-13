
const fs = require('fs');
const path = require('path')

module.exports = function(srcpath) {

  let promise = new Promise(function(resolve, reject) {

    fs.readdir(srcpath,
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
              imageType: item.split('.').pop()
            });
          });

          resolve(list);
        }
      }
    );

  });
  return promise;
};
//directory list
//file => fs.statSync(path.join(srcpath, file)).isDirectory()
