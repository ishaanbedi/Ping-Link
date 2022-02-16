const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();



mongoose.connect(process.env.MONGO_URL || "mongodb://localhost/urlShortener"
    , {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})
app.post('/shorturls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.post('/delete/:shortUrl', async (req, res) => {
    await ShortUrl.deleteOne({ short: req.params.shortUrl }).then(() => {
        console.log(req.body.shortUrl + " Entry Deleted")
    }).catch(() => {
        console.log(error)
    })
    res.redirect('/')
})
app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) { return res.sendStatus(404) }
    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})
app.listen(5050);
