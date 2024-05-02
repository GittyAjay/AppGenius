// routes.js
const {
    submitRoute,
    downloadRoute
} = require('./form-route');
const {
    socketRoute
} = require('./socket-route');

const {
    routeRoute,
    serverRoute
} = require('./route-route');

module.exports = {
    submitRoute,
    downloadRoute,
    socketRoute,
    routeRoute,
    serverRoute
};
