const express = require('express');
const { verificaToken } = require('../middlewares/authentication');
const { findById, findByIdAndUpdate } = require('../models/producto');
const Producto = require('../models/producto');

let app = express();

app.get('/producto', verificaToken, (req, resp) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'categoria descripcion')
        .exec((err, productosBD) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    error: err
                });
            }
            return resp.json({
                ok: true,
                rows: productosBD.length,
                productos: productosBD
            });
        })
});

app.get('/producto/:id', verificaToken, (req, resp) => {
    const id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'categoria descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    error: err
                });
            }
            if (!productoBD) {
                return resp.status(500).json({
                    ok: true,
                    message: `No existe producto con el id: ${id}`
                });
            }
            return resp.json({
                ok: true,
                producto: productoBD
            });
        });
});

app.get('/producto/buscar/:termino', verificaToken, (req, resp) => {
    let termino = req.params.termino;
    let regexp = new RegExp(termino, 'i');
    Producto.find({ nombre: regexp })
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre')
        .exec((err, productosBD) => {
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    error: err
                });
            }
            if (!productosBD) {
                return resp.status(500).json({
                    ok: true,
                    message: `No existe producto con el id: ${id}`
                });
            }
            return resp.json({
                ok: true,
                productos: productosBD
            });
        });
});

app.post('/producto', verificaToken, (req, resp) => {
    let body = req.body;
    console.log(req.params._id);
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoBD) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                error: err
            });
        }
        return resp.json({
            ok: true,
            productoBD
        });
    });
});

app.put('/producto/:id', verificaToken, (req, resp) => {
    let id = req.params.id;
    let body = req.body;
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!productoBD) {
            return resp.status(500).json({
                ok: false,
                error: `El producto con el id: ${id} no existe`
            });
        }
        productoBD.nombre = body.nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.descripcion = body.descripcion;
        productoBD.disponible = body.disponible;
        productoBD.categoria = body.categoria;

        productoBD.save((err, productoAct) => {
            if (err) {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        error: err
                    });
                }
            }
            if (!productoAct) {
                return resp.status(500).json({
                    ok: false,
                    error: `El producto con el id: ${id} no existe`
                });
            }
            return resp.json({
                ok: true,
                producto: productoAct
            });
        });
    });
});

app.delete('/producto/:id', verificaToken, (req, resp) => {
    const id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoBD) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                error: err
            });
        }
        return resp.json({
            ok: true,
            producto: productoBD
        });
    });
});

module.exports = app;