'use strict';

const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();
const cors = require('@koa/cors');
const faker = require('faker');
faker.local = 'ru';

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
}));

app.use(cors());

app.use(async (ctx, next) => {
  let unreadMessages = {
    "status": "ok",
    "timestamp": `${ new Date().toLocaleDateString() } ${ new Date().toLocaleTimeString() }`,
    "messages": [],
  }
  function getNewMessages() {
    for (let i = 0; i < 5; i++) {
      unreadMessages.messages.push({
        id: faker.datatype.uuid(),
        from: faker.internet.email(),
        subject: faker.name.jobTitle(),
        body: faker.random.words(10),
        received: `${ new Date().toLocaleDateString() } ${ new Date().toLocaleTimeString() }`,
      })
    }
    setInterval(getNewMessages, 3000);
  }
  getNewMessages();

  const { method } = ctx.request;
  const { url } = ctx.request;

  if ( method === 'GET' && url === '/messages/unread' ) {
    ctx.response.status = 200;
    ctx.response.body = unreadMessages;
  } else {
    ctx.response.status = 204;
    ctx.response.body = "I'm waiting your command!";
  }
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback())
server.listen( port );
