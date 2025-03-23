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
                cargarPastelesPorCategoria(this.getAttribute("data-categoria")); 
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
        icono.addEventListener("click", function () {
            const pastelId = this.getAttribute("data-id");
            window.location.href = `editar-pastel.html?id_pastel=${pastelId}`;
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
        const data = await response.json();

        categoriaSeleccionada = id_categoria;
        todosLosPasteles = data.filter(pastel => pastel.id_categoria == id_categoria);
        mostrarPrimerosCuatroPasteles();
    } catch (error) {
        console.error("Error al obtener los pasteles:", error);
    }
}

function mostrarPrimerosCuatroPasteles() {
    const pasteles = todosLosPasteles.slice(0, 4);
    mostrarPasteles(pasteles);

    document.getElementById("mostrarMas").style.display = todosLosPasteles.length > 4 ? "block" : "none";
    document.getElementById("mostrarMenos").style.display = "none";
}

function mostrarTodosLosPasteles() {
    mostrarPasteles(todosLosPasteles);
    document.getElementById("mostrarMas").style.display = "none";
    document.getElementById("mostrarMenos").style.display = "block";
}

function mostrarPasteles(pasteles) {
    const container = document.getElementById("pastelesContainer");
    container.innerHTML = pasteles.map(pastel => `
        <div class="pastel">
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

const categorias = document.querySelectorAll('.categoria');

categorias.forEach(categoria => {
    categoria.addEventListener('click', () => {
        categorias.forEach(c => c.classList.remove('p-seleccionada'));
        categoria.classList.add('p-seleccionada');
    });
});
