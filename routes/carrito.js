const { Router } = require('express');
// CONTROLLES
const { agregarProductoCarrito, getCarrito, getProductosAgotados } = require('../controllers/carrito');

// MIDDLEWARES
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/mostrar',[
    validarJWT,
    tieneRole('CLIENT_ROLE'),
    validarCampos
], getCarrito );

router.post('/agregar', [
    validarJWT,
    tieneRole('CLIENT_ROLE'),
    validarCampos
], agregarProductoCarrito);

module.exports = router;