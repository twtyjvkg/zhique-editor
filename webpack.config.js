module.exports = (env) => {
    if (env && env.NODE_ENV === 'production') {
        return require('./webpack/prod.config.js');
    } else if (env.NODE_ENV === 'demo') {
        return require('./webpack/demo.config.js');
    } else {
        return require('./webpack/dev.config.js');
    }
};