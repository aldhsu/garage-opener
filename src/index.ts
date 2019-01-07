import http from "http";
import ip from "ip";
import rpio from "rpio";
import url from "url";

const hostname = ip.address();
const key = process.env.AUTH_KEY;

const port = 8080;
const authQuery = "auth";

function isAuthenticated(reqUrl: string | undefined): boolean  {
    if (!reqUrl) { return false; }
    const parsedUrl = url.parse(reqUrl, true);
    const authKey = parsedUrl.query[authQuery];
    return authKey === key;
}

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    if (isAuthenticated(req.url)) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("OK");
        rpio.open(3, rpio.OUTPUT, rpio.HIGH);
        setTimeout(() => {
            rpio.close(3);
        }, 200);
    } else {
        res.statusCode = 401;
        res.end();
    }
});

server.listen(port, hostname);
