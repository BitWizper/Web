document.addEventListener("DOMContentLoaded", function () {
    const pastelesContainer = document.getElementById("pastelesContainer");

    if (pastelesContainer) {
        let pastelesEjemplo = pastelesContainer.innerHTML.trim() !== "" ? pastelesContainer.innerHTML : "";

        document.getElementById("pastelesLink")?.addEventListener("click", function (event) {
            event.preventDefault();
            
            if (pastelesEjemplo === "") {
                cargarImagenesEjemplo();
                pastelesEjemplo = pastelesContainer.innerHTML;
            } else {
                pastelesContainer.innerHTML = pastelesEjemplo;
                asignarEventosFavoritos();
            }
            
            pastelesContainer.scrollIntoView({ behavior: "smooth" });
        });

        cargarImagenesEjemplo();

        document.querySelectorAll(".categoria").forEach(boton => {
            boton.addEventListener("click", function () { 
                const categoriaId = this.getAttribute("data-categoria");
                document.querySelectorAll(".categoria").forEach(b => 
                    b.classList.remove("p-seleccionada")
                );
                this.classList.add("p-seleccionada");
                cargarPastelesPorCategoria(categoriaId);
            });
        });

        if (document.getElementById("mostrarMas") && document.getElementById("mostrarMenos")) {
            document.getElementById("mostrarMas").addEventListener("click", mostrarTodosLosPasteles);
            document.getElementById("mostrarMenos").addEventListener("click", mostrarPrimerosCuatroPasteles);
        }
    } else {
        console.error("No se encontró el contenedor con id 'pastelesContainer'");
    }
});

function cargarImagenesEjemplo() {
    const container = document.getElementById("pastelesContainer");
    if (!container) return;

    const ejemplos = [
        { imagen_url: "https://i.pinimg.com/736x/bd/23/db/bd23db3a27a42689661b3654bb7b3ab3.jpg", nombre: "Pastel Arcoíris", id_pastel: 1 },
        { imagen_url: "https://i.pinimg.com/736x/ac/eb/4d/aceb4d7bc6a0c3ccca161b9490414b5d.jpg", nombre: "Pastel de Chocolate Clásico", id_pastel: 2 },
        { imagen_url: "https://i.pinimg.com/736x/ec/b6/ec/ecb6ecb46df6a57fc7efc86d6b18f284.jpg", nombre: "Pastel Tres Leches", id_pastel: 3 },
        { imagen_url: "https://i.pinimg.com/736x/41/a1/42/41a142ca5d382be2ef2901fb124ddfc1.jpg", nombre: "Pastel de Frutas Tropicales", id_pastel: 4 },
        { imagen_url: "https://i.pinimg.com/736x/a0/5a/4e/a05a4e09865d6b8d9a1b0d070495b9ad.jpg", nombre: "Pastel de Rosas de Azúcar", id_pastel: 5 },
        { imagen_url: "https://i.pinimg.com/736x/b0/8f/6f/b08f6fd110b3888c13ad13c7a787de44.jpg", nombre: "Pastel de Osos", id_pastel: 6 },
        { imagen_url: "https://i.pinimg.com/736x/b3/12/6c/b3126c02d3d2837f676e77d75431ea7c.jpg", nombre: "Pastel XV años de Vainilla", id_pastel: 7 },
        { imagen_url: "https://i.pinimg.com/736x/2e/f1/11/2ef111518f4ad650ab07baf4f461510e.jpg", nombre: "Pastel de Barbie", id_pastel: 8 }
    ];

    container.innerHTML = ejemplos.map(pastel => `
        <div class="pastel" data-id="${pastel.id_pastel}">
            <img src="${pastel.imagen_url}" alt="${pastel.nombre}">
            <p>${pastel.nombre}</p>
            <div class="icons">
                <i class="fas fa-edit" data-id="${pastel.id_pastel}"></i>
                <i class="fas fa-heart ${isFavorito(pastel.id_pastel) ? 'favorito' : ''}" data-id="${pastel.id_pastel}"></i>
            </div>
        </div>
    `).join('');

    asignarEventosFavoritos();
    asignarEventosEdicion();
}

function asignarEventosEdicion() {
    document.querySelectorAll(".fa-edit").forEach(icono => {
        icono.addEventListener("click", async function() {
            const pastelId = this.getAttribute("data-id");
            console.log('ID del pastel a editar:', pastelId); // Para debug

            try {
                const response = await fetch(`http://localhost:3000/api/pastel/obtenerpasteles`);
                const pasteles = await response.json();
                const pastelSeleccionado = pasteles.find(p => p.id_pastel === parseInt(pastelId));
                
                if (pastelSeleccionado) {
                    console.log('Pastel seleccionado:', pastelSeleccionado); // Para debug
                    sessionStorage.setItem('pastelEditar', JSON.stringify(pastelSeleccionado));
                    window.location.href = `editar-pastel.html?id=${pastelId}`;
                } else {
                    console.error('Pastel no encontrado:', pastelId);
                    alert('No se encontró el pastel seleccionado');
                }
            } catch (error) {
                console.error("Error al obtener los datos del pastel:", error);
                alert('Error al cargar los datos del pastel');
            }
        });
    });
}

function isFavorito(id_pastel) {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    return favoritos.includes(id_pastel);
}

function toggleFavorito(pastelId) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    favoritos = favoritos.filter(fav => fav !== null && fav !== undefined);

    const index = favoritos.indexOf(pastelId);

    if (index !== -1) {
        favoritos.splice(index, 1);
        alert(`❌ Pastel eliminado de favoritos.`);
    } else {
        favoritos.push(pastelId);
        alert(`✅ Pastel añadido a favoritos.`);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function asignarEventosFavoritos() {
    document.querySelectorAll(".fa-heart").forEach(icono => {
        icono.addEventListener("click", function () {
            const pastelId = parseInt(this.getAttribute("data-id"));
            toggleFavorito(pastelId);
            this.classList.toggle('favorito');  
        });
    });
}

let categoriaSeleccionada = null;
let todosLosPasteles = [];

async function cargarPastelesPorCategoria(id_categoria) {
    try {
        const response = await fetch('http://localhost:3000/api/pastel/obtenerpasteles');
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        const pasteles = await response.json();
        
        // Filtrar pasteles por categoría
        todosLosPasteles = pasteles.filter(pastel => 
            parseInt(pastel.id_categoria) === parseInt(id_categoria)
        );
        
        mostrarPrimerosCuatroPasteles();
    } catch (error) {
        console.error("Error al cargar los pasteles:", error);
        alert("Error al cargar los pasteles");
    }
}

function mostrarPrimerosCuatroPasteles() {
    const pasteles = todosLosPasteles.slice(0, 4);
    mostrarPasteles(pasteles);
    
    const btnMostrarMas = document.getElementById("mostrarMas");
    const btnMostrarMenos = document.getElementById("mostrarMenos");
    
    if (btnMostrarMas) btnMostrarMas.style.display = todosLosPasteles.length > 4 ? "block" : "none";
    if (btnMostrarMenos) btnMostrarMenos.style.display = "none";
}

function mostrarTodosLosPasteles() {
    mostrarPasteles(todosLosPasteles);
    
    const btnMostrarMas = document.getElementById("mostrarMas");
    const btnMostrarMenos = document.getElementById("mostrarMenos");
    
    if (btnMostrarMas) btnMostrarMas.style.display = "none";
    if (btnMostrarMenos) btnMostrarMenos.style.display = "block";
}

function mostrarPasteles(pasteles) {
    const container = document.getElementById("pastelesContainer");
    container.innerHTML = pasteles.map(pastel => `
        <div class="pastel" data-pastel-id="${pastel.id_pastel}">
            <img src="${pastel.imagen_url}" 
                 onerror="this.onerror=null; this.src='https://i.pinimg.com/736x/8d/4d/20/8d4d20b75a8d8b13e3d2907c5c58e633.jpg';" 
                 alt="${pastel.nombre}">
            <h3>${pastel.nombre}</h3>
            <p>${pastel.descripcion || 'Sin descripción'}</p>
            <div class="price">$${pastel.precio}</div>
            <div class="stars">
                ${'★'.repeat(Math.floor(pastel.popularidad || 0))}
            </div>
            <div class="icons">
                <i class="fas fa-edit edit-icon" onclick="editarPastel(${pastel.id_pastel})"></i>
                <i class="fas fa-heart ${isFavorito(pastel.id_pastel) ? 'favorito' : ''}" 
                   onclick="toggleFavorito(${pastel.id_pastel})"></i>
            </div>
        </div>
    `).join('');
}

async function editarPastel(id_pastel) {
    try {
        const response = await fetch(`http://localhost:3000/api/pastel/obtenerpasteles`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos del pastel');
        }
        
        const pasteles = await response.json();
        const pastelSeleccionado = pasteles.find(p => p.id_pastel === id_pastel);
        
        if (pastelSeleccionado) {
            // Guardar datos del pastel en sessionStorage
            sessionStorage.setItem('pastelEditar', JSON.stringify(pastelSeleccionado));
            // Redirigir a la página de edición
            window.location.href = `editar-pastel.html?id=${id_pastel}`;
        } else {
            throw new Error('Pastel no encontrado');
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar los datos del pastel");
    }
}
