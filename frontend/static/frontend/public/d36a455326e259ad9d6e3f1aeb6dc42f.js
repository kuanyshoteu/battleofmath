import api from "!../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js";
            import content from "!!../../../node_modules/url-loader/dist/cjs.js!./index.js";

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



export default content.locals || {};