import http from "http";

http
  .createServer((req, res) => {
    res.sendDate("Hello World");
    res.end();
  })
  .listen(3000);
