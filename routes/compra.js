const { Router } = require('express');
// CONTROLLES
const { comprar } = require('../controllers/compra');

// MIDDLEWARES
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/comprar', [
    validarJWT,
    tieneRole('CLIENT_ROLE'),
    validarCampos
], comprar);

module.exports = router;