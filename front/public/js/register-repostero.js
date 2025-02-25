document.getElementById("registerReposteroForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const contrasena = document.getElementById("contrasena").value;
    const telefono = document.getElementById("telefono").value;

    // Validar la contraseña: debe ser exactamente 8 caracteres
    if (!/^[\w!@#$%^&*()\-_=+{}[\]:;"'<>,.?/\\|`~]{8}$/.test(contrasena)) {
        if (contrasena.length < 8) {
            alert("La contraseña debe tener exactamente 8 caracteres. Actualmente tiene menos.");
        } else if (contrasena.length > 8) {
            alert("La contraseña debe tener exactamente 8 caracteres. Actualmente tiene más.");
        }
        return;
    }

    // Validar el teléfono: debe contener exactamente 10 dígitos
    if (!/^\d{10}$/.test(telefono)) {
        if (telefono.length < 10) {
            alert("El número de teléfono debe tener exactamente 10 dígitos. Actualmente tiene menos.");
        } else if (telefono.length > 10) {
            alert("El número de teléfono debe tener exactamente 10 dígitos. Actualmente tiene más.");
        } else {
            alert("El número de teléfono solo debe contener dígitos.");
        }
        return;
    }

    // Datos generales para el modelo Usuario
    const userData = {
        nombre: document.getElementById("nombre").value,
        correo: document.getElementById("correo").value,
        contrasena: contrasena,
        direccion: document.getElementById("direccion").value,
        telefono: telefono,
        tipo_usuario: "Repostero"
    };

    // Datos específicos para el modelo Repostero
    const reposteroData = {
        NombreNegocio: document.getElementById("NombreNegocio").value,
        Ubicacion: document.getElementById("Ubicacion").value,
        Especialidades: document.getElementById("Especialidades").value,
        PortafolioURL: document.getElementById("PortafolioURL").value || null
    };

    try {
        const response = await fetch("http://localhost:3000/api/repostero/creareposteros", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userData, reposteroData }),
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
