const { response, request } = require('express');

const Factura = require('../models/factura');
const Orden = require('../models/orden');
const Producto = require('../models/producto');


const getFacturasPorUsuario = async (req = request, res = response) => {
    const facturas = await Factura.find({ usuario: req.params.id });

    if (facturas.length === 0) {
        return res.status(404).json({ message: 'No se encontraron facturas para el usuario especificado.' });
    }
    res.json({ facturas });

};

const getProductosDeFactura = async (req = request, res = response) => {
    const { id } = req.params;
    const factura = await Factura.findById(id);

    const productos = factura.productos;

    res.json({ productos });
};

const postFactura = async (req = request, res = response) => {
    try {
        // obtener la información de la orden

        const compra = await Orden.findOne({ usuario: req.usuario._id }).sort({ fecha: -1 }).populate('usuario', 'nombre correo').populate('productos.producto');


        // generar la factura
        const factura = {
            usuario: compra.usuario,
            fecha: compra.fecha,
            productos: compra.productos.map(p => ({
                nombre: p.producto.nombre,
                precio: p.precio,
                cantidad: p.cantidad,
            })),
            total: compra.total
        };

        const nuevaFactura = new Factura(factura);

        await nuevaFactura.save();

        // devolver la factura en la respuesta de la solicitud
        res.json(factura);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al generar la factura' });
    }
};
  
const putFactura = async (req = request, res = response) => {
    const { id } = req.params;
    const { productos } = req.body;
  
    try {
      // Obtener factura por id
      const factura = await Factura.findById(id);
      if (!factura) {
        return res.status(404).json({ message: 'La factura no existe.' });
      }
  
      // Recorrer los productos de la factura y actualizar las cantidades y los precios
      for (const producto of productos) {
        const productoFactura = factura.productos.find(
          (prod) => prod._id.toString() === producto._id
        );
        if (!productoFactura) {
          throw new Error('El producto no existe en la factura.');
        }
  
        // Actualizar la cantidad
        if (producto.cantidad) {
          // Si la cantidad nueva es menor que la anterior, sumar la diferencia a la propiedad "disponible" del producto
          if (productoFactura.cantidad > producto.cantidad) {
            const cantidadDiferencia = productoFactura.cantidad - producto.cantidad;
            await Producto.findByIdAndUpdate(productoFactura.producto, { $inc: { disponible: cantidadDiferencia } }, { new: true });
          }
          productoFactura.cantidad = producto.cantidad;
        }
  
        // Actualizar el precio
        if (producto.precio) {
          productoFactura.precio = producto.precio;
        }
      }
  
      // Actualizar el total de la factura
      factura.total = factura.productos.reduce(
        (total, producto) => total + producto.precio * producto.cantidad,
        0
      );
  
      // Guardar la factura actualizada en la BD
      await factura.save();
  
      res.json({ message: 'Factura actualizada correctamente.', factura });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  };
  
  
module.exports = {
    getFacturasPorUsuario,
    getProductosDeFactura,
    postFactura,
    putFactura

};
