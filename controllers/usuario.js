const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const getUsuarios = async (req = request, res = response) => {

    const query = { estado: true };

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador Usuario',
        listaUsuarios
    });

};

const postUsuario = async (req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuarioGuardadoDB = new Usuario({ nombre, correo, password, rol });

    const salt = bcryptjs.genSaltSync();
    usuarioGuardadoDB.password = bcryptjs.hashSync(password, salt);

    await usuarioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Usuario',
        usuarioGuardadoDB
    });

};

const putUsuario = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, img, estado, google, ...resto } = req.body;
    const usuario = await Usuario.findById(id);



    if ( resto.password ) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(resto.password, salt);
    }

    if (usuario.rol === 'ADMIN_ROLE' && req.usuario.rol === 'ADMIN_ROLE') {
        return res.status(400).json({
            msg: 'No puedes editar a otro ADMIN_ROLE'
        });
    }

    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.json({
        msg: 'PUT editar user',
        usuarioEditado
    });

};

const deleteUsuario = async(req = request, res = response) => {
    const { id } = req.params;
  
    const usuario = await Usuario.findById(id);
  
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe en la base de datos'
      });
    }
  
    if (usuario.rol === 'ADMIN_ROLE' && req.usuario.rol === 'ADMIN_ROLE') {
        return res.status(400).json({
            msg: 'No puedes eliminar a otro ADMIN_ROLE'
        });
    }
  
    const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false }, {new: true});
  
    res.json({
      msg: 'DELETE eliminar user',
      usuarioEliminado
    });
};
  
const registrar = async (req = request, res = response) => {

    const { nombre, correo, password } = req.body;
    const usuarioGuardadoDB = new Usuario({ nombre, correo, password});

    const salt = bcryptjs.genSaltSync();
    usuarioGuardadoDB.password = bcryptjs.hashSync(password, salt);

    await usuarioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Usuario',
        usuarioGuardadoDB
    });

};

const putMiUsuario = async (req = request, res = response) => {
    const {id} = req.params;
    const usuario = req.usuario._id;
    const idUsuario = usuario.toString();
    
    if (id === idUsuario) {
        const {_id, ...resto} = req.body;

        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(resto.password, salt);

        const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto, {new: true});

        res.status(200).json({
            msg: 'put api usuarios',
            usuarioEditado
        })

    } else{
        res.status(401).json({
            msg: 'Esta no es tu cuenta, no puedes editarla'

        })
    }

};

const deleteMiUsuario = async(req = request, res = response) => {
    const {id} = req.params;
    const usuario = req.usuario._id;
    const idUsuario = usuario.toString();

    if(id === idUsuario){

        const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false }, {new: true});
        res.status(200).json({
            msg: 'delete api usuarios',
            usuarioEliminado
        })

    }else{
        res.status(401).json({
            msg: 'Esta no es tu cuenta, no puedes eliminarla'


        })
    }
    
};

module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario,
    registrar,
    putMiUsuario,
    deleteMiUsuario
}


// CONTROLADOR