const { request, response, json } = require('express');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria')
const Orden = require('../models/orden');

const getProductos = async (req = request, res = response) => {

     const query = { estado: true };

     const listaProductos = await Promise.all([
         Producto.countDocuments(query),
         Producto.find(query).populate('usuario', 'nombre').populate('categoria','nombre')
     ]);
     
     res.json({
         msg: 'PRODUCTOS',
         listaProductos
     });

  };

const getProductosAgotados = async (req = request, res = response) => {

  const query = { disponible: 0 };

  const listaProductos = await Producto.find(query).populate('usuario', 'nombre').populate('categoria', 'nombre');

  res.json({
    msg: 'PRODUCTOS AGOTADOS',
    listaProductos
  });

  };

const getProductosMasVendidos = async (req = request, res = response) => {
  try {
    const productosMasVendidos = await Orden.aggregate([
      // Desenrollar los productos de cada orden en documentos separados
      { $unwind: '$productos' },
      // Agrupar por producto y calcular la cantidad total vendida
      {
        $group: {
          _id: '$productos.producto',
          cantidad: { $sum: '$productos.cantidad' }
        }
      },
      // Ordenar por cantidad descendente
      { $sort: { cantidad: -1 } },
      // Limitar a los 10 productos más vendidos
      { $limit: 2 }
    ]);

    res.json(productosMasVendidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los productos más vendidos' });
  }
  };

const getCategoriaPorID = async (req = request, res = response) => {

   const { id } = req.params;
   const categoriaById = await Categoria.findById( id );

   res.status(201).json( categoriaById );

  };

const postProducto = async (req = request, res = response) => {
    const { estado, usuario, ...body } = req.body;
    
    try{

    const productoDB = await Producto.findOne({ nombre: body.nombre }).populate('categoria');
  
    if (productoDB) {
      return res.status(400).json({
        msg: `El producto ${productoDB.nombre}, ya existe en la DB`
      });
    }
  
    const categoriaDB = await Categoria.findById(body.categoria);

    if (!categoriaDB) {
      return res.status(400).json({
        msg: `La categoría ${body.categoria} no existe en la base de datos`
      });
    }
    
  
    const data = {
      ...body,
      nombre: body.nombre.toUpperCase(),
      usuario: req.usuario._id,
      categoria: categoriaDB._id
    };
  
    const producto = await Producto(data);
    await producto.save();
  
    // Agregar el ID del nuevo producto al array de productos de la categoría
    categoriaDB.productos.push(producto._id);
  
    // Guardar los cambios en la base de datos
    await categoriaDB.save();

    
  
    res.status(201).json(producto);

    } catch (error) {
        if (error.code === 11000) {
          return res.status(400).json({
            msg: `El producto ${body.nombre} ya existe en la DB`
          });
        }
        console.log(error);
        res.status(500).json({
          msg: 'Error al intentar crear el producto'
        });
      }
  };
  
const putProducto = async (req = request, res = response) => {
    try {
      const { id } = req.params;
      const { estado, usuario, ...resto } = req.body;
  
      const productoEditado = await Producto.findByIdAndUpdate(id, resto, { new: true }).populate('categoria');
  
      res.status(200).json(productoEditado);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: 'Error al actualizar el producto en la base de datos'
      });
    }
  };

const deleteProducto = async (req = request, res = response) => {

    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(201).json(productoBorrado);

  };




module.exports = {
   getProductos,
   getProductosAgotados,
   getProductosMasVendidos,
   postProducto,
   putProducto,
   deleteProducto,
}
