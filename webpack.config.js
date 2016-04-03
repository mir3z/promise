console.log(__dirname);

module.exports = {
    entry: __dirname + '/src/promise.js',
    output: {
        path: __dirname + '/build',
        filename: 'promise.min.js',
        libraryTarget: 'umd',
        library: 'Promise',
        umdNamedDefine: true
    }
};