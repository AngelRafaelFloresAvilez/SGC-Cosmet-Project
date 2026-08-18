document.addEventListener('DOMContentLoaded', function () {

    // ---------- Vista previa de la foto de perfil antes de subirla ----------
    var inputFoto = document.getElementById('inputFoto');
    var previewFoto = document.getElementById('previewFoto');
    var formFoto = document.getElementById('formFoto');
    var TAMANIO_MAXIMO = 2 * 1024 * 1024; // debe coincidir con ArchivoUtil.TAMANIO_MAXIMO_BYTES
    var TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];

    if (inputFoto) {
        inputFoto.addEventListener('change', function () {
            var archivo = inputFoto.files && inputFoto.files[0];
            if (!archivo) return;

            if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
                mostrarErrorFoto('Formato no soportado. Usa JPG, PNG o WEBP.');
                inputFoto.value = '';
                return;
            }
            if (archivo.size > TAMANIO_MAXIMO) {
                mostrarErrorFoto('La imagen supera el tamanio maximo permitido (2 MB).');
                inputFoto.value = '';
                return;
            }
            limpiarErrorFoto();

            var lector = new FileReader();
            lector.onload = function (evento) {
                if (previewFoto) {
                    previewFoto.src = evento.target.result;
                }
            };
            lector.readAsDataURL(archivo);

            // Subida automatica al elegir el archivo (evita un paso extra al usuario).
            if (formFoto) {
                formFoto.submit();
            }
        });
    }

    function mostrarErrorFoto(mensaje) {
        var contenedor = document.getElementById('errorFoto');
        if (contenedor) {
            contenedor.textContent = mensaje;
            contenedor.classList.remove('d-none');
        }
    }

    function limpiarErrorFoto() {
        var contenedor = document.getElementById('errorFoto');
        if (contenedor) {
            contenedor.classList.add('d-none');
        }
    }

    // ---------- Cierre automatico de alertas de exito ----------
    document.querySelectorAll('.alert-auto-cierre').forEach(function (alerta) {
        setTimeout(function () {
            var instancia = bootstrap.Alert.getOrCreateInstance(alerta);
            instancia.close();
        }, 4000);
    });

    // ---------- Confirmacion antes de cancelar una cita ----------
    document.querySelectorAll('.js-confirmar-cancelacion').forEach(function (form) {
        form.addEventListener('submit', function (evento) {
            var ok = window.confirm('¿Seguro que quieres cancelar esta cita? Esta accion no se puede deshacer.');
            if (!ok) {
                evento.preventDefault();
            }
        });
    });

    // ---------- Validacion basica en el formulario de perfil (ademas de la del servidor) ----------
    var formPerfil = document.getElementById('formPerfil');
    if (formPerfil) {
        formPerfil.addEventListener('submit', function (evento) {
            var experiencia = formPerfil.querySelector('[name="experienciaAnios"]');
            if (experiencia && experiencia.value !== '' && Number(experiencia.value) < 0) {
                evento.preventDefault();
                experiencia.classList.add('is-invalid');
            }
        });
    }
});
