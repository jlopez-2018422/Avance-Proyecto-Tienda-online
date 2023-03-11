const { response, request } = require('express');

const Carrito = require('../models/Carrito');
const Producto = require('../models/producto');

const getCarrito = async (req = request, res = response) => {
  try {
    const cart = await Carrito.findOne({ Usuario: req.usuario._id }).populate('productos.producto');
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const agregarProductoCarrito = async (req = request, res = response) => {
  try {
    // DATOS QUE ENTRAN
    const { producto, cantidad } = req.body;

    // BUSCAR EL PRODUCTO
    const productoDB = await Producto.findById(producto);

    // SI CLIENTE INGRESA 6 CANTIDADES Y DISPONIBLE HAY 5 (STATUS400) 
    if (cantidad > productoDB.disponible) {
      return res.status(400).json({ message: `No hay suficientes unidades disponibles para agregar ${cantidad} al carrito` });
    }

    // OBTENER EL PRECIO DEL PRODUCTO
    const precioProducto = productoDB.precio;

    // BUSCA EL CARRITO DE COMPRAS DEL CLIENTE
    const cart = await Carrito.findOne({ Usuario: req.usuario._id });

    // Y SI NO HAY CARRITO, SE CREA UNO
    if (!cart) {
      const precioTotalProducto = precioProducto * cantidad;

      const newCarrito = new Carrito({
        Usuario: req.usuario._id,
        productos: [{ producto, cantidad, precio: precioProducto }],
        total: precioTotalProducto
      });
      await newCarrito.save();

      // SE ACTUALIZA LA CANTIDAD DE LA PROPIEDAD "DISPONIBLE" DEL PRODUCTO
      productoDB.disponible -= cantidad;
      await productoDB.save();

      return res.json(newCarrito);
    }

    // SI VA AGREGANDO CANTIDADES DEL MISMO PRODUCTO HASTA LLEGAR A LA CANTIDAD DISPONIBLE (STATUS400) 
    if (productoDB.disponible < cantidad) {
      return res.status(400).json({ message: `No hay suficientes unidades disponibles para agregar ${cantidad} al carrito` });
    }

    // SI YA ESTA EL PRODUCTO, SOLO SE SUMA LA CANTIDAD Y EL PRECIO
    const existeProducto = cart.productos.find((p) => p.producto.toString() === producto);
    if (existeProducto) {
      existeProducto.cantidad += cantidad;
      existeProducto.precio = existeProducto.cantidad * precioProducto;
    } else {
      const precioTotalProducto = precioProducto * cantidad;
      cart.productos.push({ producto, cantidad, precio: precioProducto });
    }

    // SE ACTUALIZA LA CANTIDAD DE LA PROPIEDAD "DISPONIBLE" DEL PRODUCTO
    productoDB.disponible -= cantidad;
    await productoDB.save();

    // SE CALCULA EL PRECIO TOTAL DEL CARRITO
    const precioTotalCarrito = cart.productos.reduce((total, p) => total + (p.cantidad * p.precio), 0);
    cart.total = precioTotalCarrito;

    await cart.save();

    res.json(cart);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar el producto' });
  }
};


module.exports = {
  agregarProductoCarrito,
  getCarrito,
};
