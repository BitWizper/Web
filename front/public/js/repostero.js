// Variables globales
let todosLosReposteros = [];

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", function() {
    // Mostrar mensaje inicial
    const container = document.getElementById("reposterosContainer");
    container.innerHTML = '<p class="instruccion">Selecciona una categoría para ver los reposteros disponibles</p>';

    // Configurar eventos de los botones
    document.querySelectorAll(".categoria").forEach(boton => {
        boton.addEventListener("click", async function() {
            const categoriaId = parseInt(this.getAttribute("data-categoria"));
            
            // Actualizar botón seleccionado
            document.querySelectorAll(".categoria").forEach(b => b.classList.remove("p-seleccionada"));
            this.classList.add("p-seleccionada");
            
            // Cargar reposteros de la categoría
            await cargarReposterosPorCategoria(categoriaId);
        });
    });
});

async function cargarReposterosPorCategoria(categoriaId) {
    const container = document.getElementById("reposterosContainer");
    const btnVerMas = document.getElementById("btnVerMas");
    
    try {
        container.innerHTML = '<p class="instruccion">Cargando reposteros...</p>';
        
        if (todosLosReposteros.length === 0) {
            const response = await fetch('http://localhost:3000/api/repostero/obtenereposteros');
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            todosLosReposteros = await response.json();
        }
        
        let reposterosFiltrados = todosLosReposteros
            .filter(repostero => parseInt(repostero.id_categoria) === categoriaId)
            .sort((a, b) => a.NombreNegocio.localeCompare(b.NombreNegocio)) // Ordenar alfabéticamente
            .slice(0, 4); // Mostrar solo los primeros 4

        if (reposterosFiltrados.length === 0) {
            container.innerHTML = '<p class="instruccion">No hay reposteros disponibles en esta categoría</p>';
            btnVerMas.style.display = 'none';
            return;
        }

        mostrarReposteros(reposterosFiltrados);
        btnVerMas.style.display = 'none'; // Ocultamos el botón "Ver más" ya que solo mostraremos 4

    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = '<p class="instruccion">Error al cargar los reposteros</p>';
        btnVerMas.style.display = 'none';
    }
}

function mostrarReposteros(reposteros) {
    const container = document.getElementById("reposterosContainer");
    
    container.innerHTML = reposteros.map(repostero => `
        <div class="repostero-card">
            <img src="${repostero.imagen_url || '../img/repostera1.jpg'}" 
                 onerror="this.src='../img/repostera1.jpg'" 
                 alt="${repostero.NombreNegocio}">
            <h3>${repostero.NombreNegocio}</h3>
            <p class="ubicacion">
                <i class="fas fa-map-marker-alt"></i> 
                ${repostero.Ubicacion || 'No especificada'}
            </p>
            <p class="especialidades">
                <i class="fas fa-birthday-cake"></i> 
                ${repostero.Especialidades || 'No especificadas'}
            </p>
            <a href="perfil-repostero.html?id=${repostero.id_repostero}">
                <button class="ver-perfil">Ver Perfil</button>
            </a>
        </div>
    `).join('');
}


