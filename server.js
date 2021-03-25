const Koa = require("koa");
const app = new Koa();
const path = require('path')
const static = require("koa-static");

const staticPath = './'
app.use(static(
  path.join(__dirname, staticPath)
))
app.listen(4000, function () {
  console.log("启动成功");
});