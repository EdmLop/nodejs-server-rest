const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto')

app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'No se ha seleccionado nungin archivo'
            }
        });
    }

    let tiposValidos = ['productos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            error: {
                message: `Tipo no valido, los tipos permitidos son: ${tiposValidos.join(', ')}`
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    //Extensiones permitidas
    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

    if (!extensionesValidas.includes(extension)) {
        return res.status(500).json({
            ok: false,
            error: {
                message: `Archivo invalido, las extensiones permitidas son: ${extensionesValidas.join(', ')}`
            },
            extension
        });
    }
    // Cambiar nombre archivo
    let nombreArch = `${id}-${ new Date().getMilliseconds() }.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    // archivo.mv(`uploads/${tipo}/${archivo.name}`, (err) => {
    archivo.mv(`uploads/${tipo}/${nombreArch}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (tipo === 'usuarios') {
            cargarImagenUsuario(id, nombreArch, res);
        } else {
            cargarImagenProductos(id, nombreArch, res);
        }
    });

});

function cargarImagenUsuario(id, nombreArchivo, res) {
    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            borrarImagen('usuarios', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioBD) {
            borrarImagen('usuarios', nombreArchivo);
            return res.status(400).json({
                ok: false,
                message: 'Usuario no existe'
            });
        }

        borrarImagen('usuarios', usuarioBD.img);

        usuarioBD.img = nombreArchivo;
        usuarioBD.save((err, usuarioAct) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                usuarioAct
            });
        });
    });
}

function cargarImagenProductos(id, nombreArchivo, res) {
    console.log('Entro a productos');
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            borrarImagen('productos', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            borrarImagen('productos', nombreArchivo);
            return res.status(400).json({
                ok: false,
                message: 'Producto no existe'
            });
        }

        borrarImagen('productos', productoBD.img);

        productoBD.img = nombreArchivo;
        productoBD.save((err, productoAct) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                productoAct
            });
        });
    });
}

function borrarImagen(tipo, nombreArchivo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(pathImagen)) {
        console.log('Entro al borrado');
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;