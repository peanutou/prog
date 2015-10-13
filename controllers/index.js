// Create endpoint /* for all methods
exports.allIndex = function (req, res, next) {
    res.render('index', { title: 'Prog!' });
};