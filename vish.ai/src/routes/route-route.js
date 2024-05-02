function routeRoute(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
}
function serverRoute() {
    console.log('Server is running on port 3000');
}
module.exports = {
    routeRoute,
    serverRoute
}