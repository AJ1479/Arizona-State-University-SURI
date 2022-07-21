const fse = require('fs-extra');

const srcDir = __dirname + `/react_app/build/`;
const destDir = __dirname + `/react_deploy/`;

// To copy a folder or file  
fse.copySync(srcDir, destDir, { overwrite: true }, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log("success!");
    }
});