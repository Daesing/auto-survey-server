global.navigator = {appName: 'nodejs'}; // fake the navigator object
global.window = {}; // fake the window object

const encrypt = require('jsencrypt').default;

module.exports.JsEncrypt = encrypt;