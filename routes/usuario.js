//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, postUsuario, putUsuario, deleteUsuario, registrar, deleteMiUsuario, putMiUsuario } = require('../controllers/usuario');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();
                                                                                // CRUD DE USUARIOS

            // MOSTRAR
router.get('/mostrar', getUsuarios);

            //Agregar Usuario con cualquier tipo de rol
router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    check('rol').custom(  esRoleValido ),
    validarCampos,
] ,postUsuario);

            // Editar Usuario
router.put('/editar/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom(  esRoleValido ),
    validarCampos
] ,putUsuario);

            // Eliminar Usuario
router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,deleteUsuario);


// EDITAR CLIENTE SU PROPIA CUENTA
router.put('/editarMiCuenta/:id', [
    validarJWT,
    tieneRole('CLIENT_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,putMiUsuario);

// ELIMINAR CLIENTE SU PROPIA CUENTA

router.delete('/eliminarMiCuenta/:id', [
    validarJWT,
    tieneRole('CLIENT_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,deleteMiUsuario);

                // REGISTRAR CON ROL DEFAULT CLIENT
router.post('/registrar', registrar);

module.exports = router;

// ROUTES