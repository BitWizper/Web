document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    // Función para realizar la búsqueda
    async function realizarBusqueda(termino) {
        try {
            // Obtener todos los pasteles
            const responsePasteles = await fetch('http://localhost:3000/api/pastel/obtenerpasteles');
            const pasteles = await responsePasteles.json();

            // Obtener todos los reposteros
            const responseReposteros = await fetch('http://localhost:3000/api/repostero/obtenerreposteros');
            const reposteros = await responseReposteros.json();

            // Filtrar resultados
            const resultadosPasteles = pasteles.filter(pastel => 
                pastel.nombre.toLowerCase().includes(termino.toLowerCase()) ||
                pastel.descripcion.toLowerCase().includes(termino.toLowerCase())
            );

            const resultadosReposteros = reposteros.filter(repostero => 
                repostero.nombre.toLowerCase().includes(termino.toLowerCase()) ||
                repostero.especialidad.toLowerCase().includes(termino.toLowerCase())
            );

            // Mostrar resultados
            mostrarResultados(resultadosPasteles, resultadosReposteros);
        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
            mostrarError('No se pudieron obtener los resultados de la búsqueda');
        }
    }

    // Función para mostrar los resultados
    function mostrarResultados(pasteles, reposteros) {
        // Crear el contenedor de resultados si no existe
        let resultadosContainer = document.getElementById('resultados-busqueda');
        if (!resultadosContainer) {
            resultadosContainer = document.createElement('div');
            resultadosContainer.id = 'resultados-busqueda';
            document.querySelector('.header').insertAdjacentElement('afterend', resultadosContainer);
        }

        // Limpiar resultados anteriores
        resultadosContainer.innerHTML = '';

        // Estilos para el contenedor de resultados
        resultadosContainer.style.cssText = `
            position: absolute;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 1200px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            z-index: 1000;
        `;

        if (pasteles.length === 0 && reposteros.length === 0) {
            resultadosContainer.innerHTML = '<p style="text-align: center; color: #731D3C;">No se encontraron resultados</p>';
            return;
        }

        // Mostrar resultados de pasteles
        if (pasteles.length > 0) {
            const pastelesHTML = `
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #731D3C; margin-bottom: 15px;">Pasteles</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                        ${pasteles.map(pastel => `
                            <div style="background-color: #F2F0E4; border-radius: 8px; padding: 15px; text-align: center;">
                                <img src="${pastel.imagen_url}" alt="${pastel.nombre}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
                                <h4 style="color: #8C1B2F; margin-bottom: 5px;">${pastel.nombre}</h4>
                                <p style="color: #731D3C; font-size: 0.9em;">${pastel.descripcion}</p>
                                <button onclick="window.location.href='categorias.html'" style="background-color: #A65168; color: white; border: none; padding: 5px 10px; border-radius: 4px; margin-top: 10px; cursor: pointer;">Ver Detalles</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            resultadosContainer.innerHTML += pastelesHTML;
        }

        // Mostrar resultados de reposteros
        if (reposteros.length > 0) {
            const reposterosHTML = `
                <div>
                    <h3 style="color: #731D3C; margin-bottom: 15px;">Reposteros</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                        ${reposteros.map(repostero => `
                            <div style="background-color: #F2F0E4; border-radius: 8px; padding: 15px; text-align: center;">
                                <img src="${repostero.imagen_url || '../img/default-profile.jpg'}" alt="${repostero.nombre}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 10px;">
                                <h4 style="color: #8C1B2F; margin-bottom: 5px;">${repostero.nombre}</h4>
                                <p style="color: #731D3C; font-size: 0.9em;">${repostero.especialidad}</p>
                                <button onclick="window.location.href='reposteros.html'" style="background-color: #A65168; color: white; border: none; padding: 5px 10px; border-radius: 4px; margin-top: 10px; cursor: pointer;">Ver Perfil</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            resultadosContainer.innerHTML += reposterosHTML;
        }

        // Agregar botón para cerrar resultados
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 24px;
            color: #731D3C;
            cursor: pointer;
        `;
        closeButton.onclick = () => resultadosContainer.remove();
        resultadosContainer.appendChild(closeButton);
    }

    // Función para mostrar errores
    function mostrarError(mensaje) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #f44336;
            color: white;
            padding: 15px 25px;
            border-radius: 4px;
            z-index: 1000;
        `;
        errorDiv.textContent = mensaje;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    // Event listeners
    searchBtn.addEventListener('click', () => {
        const termino = searchInput.value.trim();
        if (termino) {
            realizarBusqueda(termino);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const termino = searchInput.value.trim();
            if (termino) {
                realizarBusqueda(termino);
            }
        }
    });

    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', (e) => {
        const resultadosContainer = document.getElementById('resultados-busqueda');
        const searchBar = document.querySelector('.search-bar');
        
        if (resultadosContainer && 
            !resultadosContainer.contains(e.target) && 
            !searchBar.contains(e.target)) {
            resultadosContainer.remove();
        }
    });
}); 