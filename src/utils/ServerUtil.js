class ServerUtil {
    // Normalize a port into a number, string, or false.
    normalizePort(val) {
        var port = parseInt(val, 10);
    
        if (isNaN(port)) {
            // Named pipe
            return val;
        }
    
        if (port >= 0) {
            // Port number
            return port;
        }
    
        return false;
    }
}

module.exports = new ServerUtil;
