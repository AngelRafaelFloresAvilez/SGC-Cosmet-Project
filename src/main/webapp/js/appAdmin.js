document.addEventListener('DOMContentLoaded', function () {

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
});
