const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true , 'El nombre de la categoria es obligatorio'],
        unique: true
    },
    precio: {
        type: Number,
        default: 0
    },
    descripcion: { 
        type: String 
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    disponible: { 
        type: Number,
        required: true,
        default: 0
    },
});


module.exports = model('Producto', ProductoSchema);