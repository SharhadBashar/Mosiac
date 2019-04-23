const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const Filter = require('node-image-filter');
const pictures = require('./picturesModel');

app.use(express.json());

app.get('/pictures', (req, res) => {
    img = '';
    for (var i = 1; i < pictures.length; i++) {
        img += "<img src='" + pictures[i].link + "'/>";
    }
    html = `<!DOCTYPE html><html><body><h1>Saved images</h1>${img}</body></html>`
    fs.writeFile(__dirname + "/Saved_Pictures/gallery.html", html, 
    function(err) {
        if(err) {
            return console.log(err);
        }
    console.log("The file was saved!");
    }); 
    res.send(pictures);
});

//for getting one picture
app.get('/picture/:id', (req, res) => {
    const item = pictures.find((arr) => { 
        return arr.id === parseInt(req.params.id)
    });
    if (!item) {
        res.status(404).send('Item not found');
    }
    res.send(item);
});

//saves file with filter
app.post('/save', (req, res) => {
    const id = pictures.length + 1;
    const imagePath = path.join(__dirname, '/Pictures/' + req.body.name);
    const savePath = path.join(__dirname, '/Saved_Pictures/' + id + req.body.name);
    const filters = req.body.filters;
    const pictureArr = {
        id: id,
        link: id + req.body.name,
        filters: filters
    }
    pictures.push(pictureArr);
    if (filters === 'grayscale') {
        Filter.render(imagePath, Filter.preset.grayscale, function (result) {
            result.data.pipe(fs.createWriteStream(savePath)); // save local
        })
    }
    else if (filters === 'sepia') {
        Filter.render(imagePath, Filter.preset.sepia, function (result) {
            result.data.pipe(fs.createWriteStream(savePath)); // save local
        })
    }
    else if (filters === 'blur') {
        let options = {
            value : 10
        };
        Filter.render(imagePath, Filter.preset.blur, options, function (result) {
            result.data.pipe(fs.createWriteStream(savePath)); // save local
        })
    }
    else if (filters === 'brightness') {
        let options = {
            value : 50
        };
        Filter.render(imagePath, Filter.preset.brightness, options, function (result) {
            result.data.pipe(fs.createWriteStream(savePath)); // save local
        })
    }
    else if (filters === 'invert') {
        let options = {
            value : 50
        };
        Filter.render(imagePath, Filter.preset.invert, options, function (result) {
            result.data.pipe(fs.createWriteStream(savePath)); // save local
        })
    }
    else {
        fs.createReadStream(imagePath).pipe(fs.createWriteStream(savePath));
    }
    res.send(pictures);
});


//deletes picture
app.delete('/picture/:id', (req, res) => {
    const item = pictures.find((arr) => { 
        return arr.id === parseInt(req.params.id)
    });
    if (!item) {
        res.status(404).send('Item not found');
    }
    const index = pictures.indexOf(item);
    pictures.splice(index, 1);
    fs.unlinkSync(__dirname + 'Saved_Picture/' + index + 'test.png');
    res.send(pictures);
})

module.exports = app;