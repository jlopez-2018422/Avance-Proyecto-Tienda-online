const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio']
    },
    correo: {
      type: String,
      required: [true, 'El correo es obligatorio' ],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'El password es obligatorio' ]
    },
    img: {
      type: String
    },
    rol: {
      type: String,
      required: true,
      default: 'CLIENT_ROLE'
    },
    estado: {
      type: Boolean,
      default: true
    },
    google: {
      type: Boolean,
      default: false
    },
    compras: [
      {
        productos: [{
          producto: {
            type: Schema.Types.ObjectId,
            ref: 'Producto',
            required: true,
          },
          cantidad: {
            type: Number,
            required: true,
            min: 1,
          },
        }],
        total: {
          type: Number,
          required: true,
          min: 0,
        },
        fecha: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  });
  


module.exports = model('Usuario', UsuarioSchema);