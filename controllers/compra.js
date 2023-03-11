const { response, request } = require('express');

const Carrito = require('../models/Carrito');
const Producto = require('../models/producto');
const Orden = require('../models/orden');

const obtenerOrdenesPorUsuario = async (req = request, res = response) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id);
    const ordenes = await Orden.find({ usuario: req.usuario._id });
    res.json({ usuario, ordenes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las órdenes del usuario.' });
  }
};

const comprar = async (req = request, res = response) => {
    try {
      // EL CARRITO DEL CLIENTE
      const cart = await Carrito.findOne({ Usuario: req.usuario._id }).populate('productos.producto');
  
      // Verificar si el carrito tiene productos
      if (!cart || !cart.productos || !cart.productos.length) {
        return res.status(400).json({ message: 'El carrito está vacío, no se puede realizar la compra.' });
      }
  
      // CALCULAR EL TOTAL DE LA COMPRA
      let total = 0;
      cart.productos.forEach((p) => {
        total += p.producto.precio * p.cantidad;
      });
  
      // ELIMINAR EL CARRITO QUE TENIA EL USUARIO
      await Carrito.findOneAndDelete({ Usuario: req.usuario._id });
  
      // CREAR NUEVA ORDEN
      const nuevaOrden = new Orden({
        usuario: req.usuario._id,
        productos: cart.productos,
        total,
      });
  
      //GUARDAR EN LA DB 
      await nuevaOrden.save();
  
      res.json({ message: 'La compra se realizó con éxito.' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al hacer la compra.' });
    }
};
  


module.exports = {
  comprar,
  obtenerOrdenesPorUsuario
};
