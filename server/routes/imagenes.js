const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/authentication');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    let pathNoImage = path.resolve(__dirname, `../assets/no-image.jpg`);

    if (!fs.existsSync(pathImagen)) {
        console.log(`No existe la imagen`);
        res.sendFile(pathNoImage);
    } else {
        res.sendFile(pathImagen);
    }
});

module.exports = app;