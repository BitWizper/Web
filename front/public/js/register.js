document.getElementById("registerForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const contrasena = document.getElementById("contrasena").value;
    const telefono = document.getElementById("telefono").value;

    // Validar la contraseña: debe ser exactamente 8 caracteres
    if (contrasena.length !== 8) {
        alert(`La contraseña debe tener exactamente 8 caracteres. Actualmente tiene ${contrasena.length}.`);
        return;
    }

    // Validar el teléfono: debe contener exactamente 10 dígitos numéricos
    if (!/^\d{10}$/.test(telefono)) {
        alert("El número de teléfono debe tener exactamente 10 dígitos numéricos.");
        return;
    }

    // Datos del usuario en el formato esperado
    const userData = {
        nombre: document.getElementById("nombre").value,
        correo: document.getElementById("correo").value,
        contrasena: contrasena,
        direccion: document.getElementById("direccion").value,
        telefono: telefono,
        tipo_usuario: "Cliente"
    };

    try {
        const response = await fetch("http://localhost:3000/api/usuario/crearusuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userData }), // Enviamos el objeto dentro de { userData }
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registro exitoso. Ahora inicia sesión.");
            window.location.href = "login.html";
        } else {
            alert(data.error || "Error en el registro.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
