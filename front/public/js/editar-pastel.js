document.addEventListener('DOMContentLoaded', function() {
    // Obtener el ID del pastel de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const pastelId = urlParams.get('id');
    
    // Obtener los datos del pastel guardados en sessionStorage
    const pastelData = JSON.parse(sessionStorage.getItem('pastelEditar'));
    
    if (pastelData) {
        // Actualizar la imagen del pastel
        const pastelImage = document.querySelector('.cake-image img');
        if (pastelImage) {
            pastelImage.src = pastelData.imagen_url || 'https://i.pinimg.com/736x/8d/4d/20/8d4d20b75a8d8b13e3d2907c5c58e633.jpg';
            pastelImage.alt = pastelData.nombre;
        }

        // Actualizar el título con el nombre del pastel
        const titulo = document.querySelector('.cake-editor h1');
        if (titulo) {
            titulo.textContent = `Editor de Pastel: ${pastelData.nombre}`;
        }

        // Crear sección de información actual del pastel
        const infoSection = document.createElement('div');
        infoSection.className = 'current-cake-info';
        infoSection.innerHTML = `
            <h2>Información Actual del Pastel</h2>
            <p><strong>Nombre:</strong> ${pastelData.nombre}</p>
            <p><strong>Descripción:</strong> ${pastelData.descripcion}</p>
            <p><strong>Precio:</strong> $${pastelData.precio}</p>
            <p><strong>Popularidad:</strong> ${pastelData.popularidad} ★</p>
            <p><strong>Categoría:</strong> ${pastelData.id_categoria}</p>
        `;

        // Insertar la sección de información antes del formulario
        const cakeOptions = document.querySelector('.cake-options');
        if (cakeOptions) {
            cakeOptions.insertBefore(infoSection, cakeOptions.firstChild);
        }
    } else {
        console.error('No se encontraron datos del pastel');
    }
});
