const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

//Controllers
const { postProducto, putProducto, deleteProducto, getProductos, getProductosAgotados, getProductosMasVendidos,  } = require('../controllers/producto');
const { nombreExiste, esRoleValido } = require('../helpers/db-validators');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

//Manejo de rutas

// Obtener todas las productos - publico
router.get('/mostrar', getProductos);

router.get('/productosAgotados',[
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    validarCampos
], getProductosAgotados );

router.get('/productosMasVendidos',[
    validarJWT,
    tieneRole('ADMIN_ROLE','CLIENT_ROLE'),
    validarCampos
], getProductosMasVendidos );

// Crear producto - privada - cualquier persona con un token válido
router.post('/agregar', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(nombreExiste),
    validarCampos
], postProducto);

// Actuaizar producto - privada - cualquier persona con un token válido
router.put('/editar/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], putProducto);

//Borrar un producto - privado - Solo el admin puede eliminar una categoria (estado: false)
router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    validarCampos
], deleteProducto);



module.exports = router;