import http from "http";
import fs from "fs";

// Create the server
const myServer = http.createServer(reqHandler);

// Request handler function
function reqHandler(req, res) {
    const clientIp = req.socket.remoteAddress;
    const requestTime = new Date().toISOString();
    const logMessage = `[${requestTime}] Request from IP: ${clientIp}, URL: ${req.url}\n`;

    // Write the log message to log.txt
    fs.appendFile("log.txt", logMessage, (err) => {
        if (err) {
            console.error("Failed to write to log file:", err);
        }
    });

    res.write(logMessage);

    switch (req.url) {
        case "/":
            res.end("Home Page");
            break;

        case "/about":
            res.end("I am Sanjeet");
            break;
        default:
            res.end("404 page not found");
            break;
    }
};


// Start the server
myServer.listen(3000, () => console.log("Server started on port 3000!"));
