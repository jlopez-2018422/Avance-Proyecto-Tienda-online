const { request, response, json } = require('express');
const Producto = require('../models/producto');

const getCategorias = async (req = request, res = response) => {

     const query = { estado: true };

     const listaCategorias = await Promise.all([
         Categoria.countDocuments(query),
         Categoria.find(query).populate('usuario', 'nombre')
     ]);
     
     res.json({
         msg: 'get Api - Controlador Usuario',
        listaCategorias
     });

}


const getCategoriaPorID = async (req = request, res = response) => {

   const { id } = req.params;
   const categoriaById = await Categoria.findById( id ).populate('usuario', 'nombre');

   res.status(201).json( categoriaById );

}


const postProducto = async (req = request, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe en la DB`
        });
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = await Producto( data );
    await producto.save();
    res.status(201).json( producto );
   
}


const putProducto = async (req = request, res = response) => {

   res.json({
        msg: 'PUT'
   })

}

const deleteProducto = async (req = request, res = response) => {

   res.json({
        msg: 'DELETE'
   })

}




module.exports = {
   postProducto,
   putProducto,
   deleteProducto
}
