const jwt = require('jsonwebtoken');

//===================
//Verifica Token
//===================

let verificaToken = (req, res, next) => {
    let token = req.get('Autorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}

let verificaAdmin_ROLE = (req, res, next) => {
    if (req.usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: 'Privilegios insufucientes'
        });
    }
    next();
}
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    verificaToken,
    verificaAdmin_ROLE,
    verificaTokenImg
}