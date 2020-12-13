const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

/* let rolesValidos = {
    values: ['ADMIN_ROLE', 'SUPER_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}
 */

let categoriaSchema = new Schema({
    categoria: { type: String, unique: true, required: [true, 'La categoria es requerida'] },
    descripcion: { type: String, required: false },
    usuario: { type: Schema.ObjectId, ref: 'Usuario', requiered: true }
});

categoriaSchema.methods.toJSON = function() {
    let categoria = this;
    let categoriaObject = categoria.toObject();
    delete categoriaObject.password;
    return categoriaObject;
}

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Categoria', categoriaSchema);