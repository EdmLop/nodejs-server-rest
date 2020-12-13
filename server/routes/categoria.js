const express = require('express');
const _ = require('underscore');
let { verificaToken, verificaAdmin_ROLE } = require('../middlewares/authentication');
let app = express();
let Categoria = require('../models/categoria');

/* 
Mostrar todas las categorias
 */
app.get('/categoria', verificaToken, (req, resp) => {

    Categoria.find().sort('categoria').populate('usuario', 'nombre email').exec((err, categorias) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                err
            });
        }
        return resp.json({
            ok: true,
            categorias
        });
    });
});

/* 
Mostrar una categoria por id
 */
app.get('/categoria/:id', verificaToken, (req, resp) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                err
            });
        }
        return resp.json({
            ok: true,
            categoria
        })
    });
});

/* 
Dar de alta una categoria
 */
app.post('/categoria', verificaToken, (req, resp) => {
    let body = req.body;
    let categoria = new Categoria({
        categoria: body.categoria,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            console.log(err);
            return resp.status(400).json({
                ok: false,
                err
            });
        }
        return resp.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

/* 
Actualizar descripcion de categoria
 */
app.put('/categoria/:id', verificaToken, (req, resp) => {
    //Actualiza descripcion de la categoria
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    Categoria.findByIdAndUpdate(id, body, (err, categoriaBD) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                err
            });
        }
        return resp.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});

/* 
Borra categoria
 */
app.delete('/categoria/:id', [verificaToken, verificaAdmin_ROLE], (req, resp) => {
    //Borrado fisico
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                err
            });
        }
        return resp.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

module.exports = app;