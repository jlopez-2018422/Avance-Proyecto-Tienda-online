const { request, response } = require('express');
const Categoria = require('../models/categoria');
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

};

const getCategoriaPorID = async (req = request, res = response) => {

   const { id } = req.params;
   const categoriaById = await Categoria.findById( id ).populate('usuario', 'nombre');

   res.status(201).json( categoriaById );

};

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

};

const putCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...resto } = req.body;

    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.usuario._id;

    const categoriaEditada = await Categoria.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json(categoriaEditada);

};

const deleteCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(201).json(categoriaBorrada);

};

const deleteCategoriad = async (req, res) => {
    const categoriaPorDefecto = await Categoria.findOne({ nombre: "POR DEFECTO" });
    const { id } = req.params;
  
    try {
      // Encontrar la categor??a que se desea eliminar
      const categoria = await Categoria.findById(id);
  
      // Encontrar todos los productos que pertenecen a la categor??a que se desea eliminar
      const productos = await Producto.find({ categoria: categoria._id });
  
      // Establecer la categor??a por defecto
      const categoriaPorDefecto = await Categoria.findOne({ nombre: "POR DEFECTO" });
        
      if (!categoriaPorDefecto) {
        return res.status(404).json({ msg: "Categor??a por defecto no encontrada" });
      }
      
      // Actualizar los productos que pertenecen a la categor??a eliminada para que pertenezcan a la categor??a por defecto
      const promises = productos.map(async (producto) => {
        producto.categoria = categoriaPorDefecto._id;
        await producto.save();
      });
  
      // Eliminar la categor??a
      await categoria.remove();
  
      res.json({ msg: "Categor??a eliminada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al eliminar la categor??a" });
    }
};



module.exports = {
    getCategorias,
    getCategoriaPorID,
    postCategoria,
    putCategoria,
    deleteCategoria,
    deleteCategoriad
}
