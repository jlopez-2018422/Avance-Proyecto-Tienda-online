const { request, response } = require('express');
const Categoria = require('../models/categoria');


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


const postCategoria = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json(categoria);

}


const putCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...resto } = req.body;

    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.usuario._id;

    const categoriaEditada = await Categoria.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json(categoriaEditada);

}

const deleteCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(201).json(categoriaBorrada);

}




module.exports = {
    getCategorias,
    getCategoriaPorID,
    postCategoria,
    putCategoria,
    deleteCategoria
}
