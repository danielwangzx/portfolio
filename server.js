'use strict'
const Koa = require('koa')
const Router = require('koa-router')
const fetch = require('node-fetch')
const LRU = require('lru-cache')
const assert = require('assert')
const cors = require('@koa/cors');

const serverRouter = new Router()

const APPID = process.env.APPID
// assert(APPID,"APPID must be set before USE")

const flickerURL = 'https://www.flickr.com/services/feeds/photos_public.gne'
const maxAge = process.env.port ? 60000 * 60 : 5000;
const cache = new LRU({
    maxAge,
    max: 100,
})

serverRouter.get('/api/pictures/:tag', async ctx => {
    const { tag } = ctx.params;
    if (cache.peek(tag)) {
        ctx.body = cache.get(tag);
        console.log(`fetch picture feed for ${tag} from local cache`)
        return
    }
    const requestURL = `${flickerURL}?tags=${tag}&format=json&nojsoncallback=1`
    const res = await fetch(requestURL)
    console.log(`fetch flicker img feed for ${tag} from remote server!`)
    if (res.ok) {
        const { items } = await res.json();
        cache.set(tag, items);
        ctx.body = items;
    } else {
        if (res.status === 404) {
            ctx.body = {
                message: `${tag} not found`
            }
            ctx.status = 404
        }
    }
})

serverRouter.get('/',async ctx=>{
    ctx.body = {
        message: 'connected successfully'
    }
})

const app = new Koa()
app.use(cors());
app.use(serverRouter.routes())
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`App listens on PORT: ${PORT}`)
})

