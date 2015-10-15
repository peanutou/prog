var tinylr = require('tiny-lr')(),
    connectLivereload = require('connect-livereload'),
    watch = require('gulp-watch');

tinylr.listen(process.env.LR_PORT || 4003);

watch('./public/**/*', function (e) {
     notifyLiveReload(e);
});

function notifyLiveReload(e) {
    var fileNames = [];
    fileNames.push(e.path);
    // because angular will responsible for update css
    // so when a css file updated, coresponding js file need to be updated too
    var pattern = /(.*)\.(.*)/m;
    var file_and_ext = pattern.exec(e.path);
    if (file_and_ext != null && file_and_ext[2] === 'css') {
        fileNames.push(file_and_ext[1] + '.js')
    }
    
    tinylr.changed({ 
        body: {
            files: fileNames
        }
    })
}

module.exports = connectLivereload({ port: process.env.LR_PORT || 4003 });