const mongoose = require('mongoose');

const CarritoSchema = new mongoose.Schema({
    productos: [{
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Producto',
            required: true
        },
        cantidad: {
            type: Number,
            default: 0
        },
        precio: {
            type: Number,
            required: true
        }
    }],
    Usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    total: {
        type: Number,
        required: true,
        default: 0
      }
});

module.exports = mongoose.model('Carrito', CarritoSchema);