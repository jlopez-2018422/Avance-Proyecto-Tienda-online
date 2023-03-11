const mongoose = require('mongoose');
const { Schema } = mongoose;

const facturaSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  productos: [
    {
      nombre: {
        type: String,
        required: true
      },
      precio: {
        type: Number,
        required: true
      },
      cantidad: {
        type: Number,
        required: true
      }
    }
  ],
  total: {
    type: Number,
    required: true
  }
});


module.exports = mongoose.model('Factura', facturaSchema);

