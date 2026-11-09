document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("form");

    if (formulario) {
        formulario.addEventListener("submit", (e) => {
            const dueño = document.querySelector("input[name='dueño']").value;
            const mascota = document.querySelector("input[name='mascota']").value;

            if (!dueño.trim() || !mascota.trim()) {
                alert("Por favor, completa los campos obligatorios del dueño y la mascota.");
                e.preventDefault(); // Detiene el envío si hay campos vacíos
            } else {
                console.log("Cita enviada con éxito para la mascota: " + mascota);
            }
        });
    }
});