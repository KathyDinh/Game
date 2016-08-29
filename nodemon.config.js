var path = require('path');
module.exports = function (nodeAppPort) {
    var config = {
        script: 'app.js',
        delayTime: 10,
        verbose: false,
        ignore: [
            "/node_modules"
        ],
        watch: ["."],
        ext: "js html",
        env: {
            "PORT": nodeAppPort
        }
    };

    return config;
};