const path = require('path');
function routeRoute(req, res) {
    const twoLevelsDownDir = path.join(__dirname, '..', '..');
    res.sendFile(path.join(twoLevelsDownDir, 'public', 'index.html'));
}
function serverRoute() {
    console.log('Server is running on port 3000');
}
module.exports = {
    routeRoute,
    serverRoute
}