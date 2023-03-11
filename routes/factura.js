const { Router } = require('express');
// CONTROLLES
const { postFactura, getFacturasPorUsuario, getProductosDeFactura, putFactura,  } = require('../controllers/factura');

// MIDDLEWARES
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
const { validarCampos } = require('../middlewares/validar-campos');

const { check } = require('express-validator');

const router = Router();

router.get('/facturas/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    validarCampos
], getFacturasPorUsuario);

router.get('/productoDeFactura/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    validarCampos
], getProductosDeFactura);

router.post('/', [
    validarJWT,
    tieneRole('CLIENT_ROLE'),
    validarCampos
], postFactura);

router.put('/editar/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
] ,putFactura);

module.exports = router;