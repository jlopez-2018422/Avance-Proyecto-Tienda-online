const { request, response } = require('express');
const { ObjectId  } = require('mongoose').Types;

const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async ( termino = '', res = response) => {
    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ){
        const usuario = await Usuario.findById(termino);
        return res.jason({
            result: ( usuario ) ? [ usuario ] : []
        })
    }

    const regex = new RegExp( termino, 'i');

    const usuarios = await Usuario.find({
        $or : [ { nombre: regex }, { correo: regex}],
        $and: [ { estado: true } ]
    })

    res.json({
        results: usuarios
    })

}

// const buscarCategorias = async (termino = '', res = response) => {
//     const esMongoID = ObjectId.isValid( termino );
    
//     if (esMongoID) {
//         const categoria = await Categoria.findById(termino)
//         .populate('productos', 'nombre');
//         return res.json({
//             result: ( categoria ) ? [ categoria ] : []
//         })
//     }

//     const regex = new RegExp (termino, 'i');

//     const categorias = await Categoria.find({
//         $or : [ { nombre: regex }],
//         $and: [ { estado: true } ]
//     })
//     .populate('productos', 'nombre');
//     res.json({
//         results: categorias
//     })
// }

const buscarCategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid( termino );
    
    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        const productos = await Producto.find({ categoria: categoria._id });
        const productosNombres = productos.map(producto => producto.nombre);
        return res.json({
            result: ( categoria ) ? [ { ...categoria.toObject(), productos: productosNombres } ] : []
        })
    }

    const regex = new RegExp (termino, 'i');

    const categorias = await Categoria.find({
        $or : [ { nombre: regex }],
        $and: [ { estado: true } ]
    })

    const categoriasConProductos = await Promise.all(categorias.map(async (categoria) => {
        const productos = await Producto.find({ categoria: categoria._id });
        const productosNombres = productos.map(producto => producto.nombre);
        return { ...categoria.toObject(), productos: productosNombres };
    }));

    res.json({
        results: categoriasConProductos
    })
}


const buscarProductos = async (termino = '', res = response )=>{
    const esMongoID = ObjectId.isValid( termino );

    if (esMongoID) {
        const producto = await Producto.findById(termino);
        return res.json({
            result: (producto) ? [ producto] : []
        })
    }

    const regex = new RegExp (termino, 'i');
    
    const productos = await Producto.find({
        $or : [ { nombre : regex }],
        $and : [ {estado : true}]
    })

    res.json({
        results: productos
    })
}

const buscar = (req = request, res = response) => {
    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `La colección: ${ coleccion } no existe en la DB
            Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
        break;
        case 'categorias':
            buscarCategorias(termino, res)
        break;
        case 'productos':
            buscarProductos(termino, res)
        break;
    
        default:
            break;
    }

}



module.exports = {
    buscar
}