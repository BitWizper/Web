document.addEventListener("DOMContentLoaded", function () {
    const pastelesContainer = document.getElementById("pastelesContainer");
    let pastelesEjemplo = "";
    
    if (pastelesContainer.innerHTML.trim() !== "") {
        pastelesEjemplo = pastelesContainer.innerHTML;
    }

    document.getElementById("pastelesLink").addEventListener("click", function (event) {
        event.preventDefault();
        
        if (pastelesEjemplo === "") {
            cargarImagenesEjemplo();
            pastelesEjemplo = pastelesContainer.innerHTML;
        } else {
            pastelesContainer.innerHTML = pastelesEjemplo;
        }
        
        pastelesContainer.scrollIntoView({ behavior: "smooth" });
    });

    cargarImagenesEjemplo();

    const botonesCategoria = document.querySelectorAll(".categoria");
    if (botonesCategoria.length > 0) {
        botonesCategoria.forEach(boton => 
            boton.addEventListener("click", function () { 
                cargarPastelesPorCategoria(this.getAttribute("data-categoria")); 
            })
        );
    } else {
        console.error("No se encontraron botones de categorías en el DOM.");
    }

    if (document.getElementById("mostrarMas") && document.getElementById("mostrarMenos")) {
        document.getElementById("mostrarMas").addEventListener("click", mostrarTodosLosPasteles);
        document.getElementById("mostrarMenos").addEventListener("click", mostrarPrimerosCuatroPasteles);
    }
});

function cargarImagenesEjemplo() {
    const container = document.getElementById("pastelesContainer");
    if (!container) return;

    const ejemplos = [
        { imagen_url: "https://i.pinimg.com/736x/bd/23/db/bd23db3a27a42689661b3654bb7b3ab3.jpg", nombre: "Pastel Arcoíris" },
        { imagen_url: "https://i.pinimg.com/736x/ac/eb/4d/aceb4d7bc6a0c3ccca161b9490414b5d.jpg", nombre: "Pastel de Chocolate Clásico" },
        { imagen_url: "https://i.pinimg.com/736x/ec/b6/ec/ecb6ecb46df6a57fc7efc86d6b18f284.jpg", nombre: "Pastel Tres Leches" },
        { imagen_url: "https://i.pinimg.com/736x/41/a1/42/41a142ca5d382be2ef2901fb124ddfc1.jpg", nombre: "Pastel de Frutas Tropicales" },
        { imagen_url: "https://i.pinimg.com/736x/a0/5a/4e/a05a4e09865d6b8d9a1b0d070495b9ad.jpg", nombre: "Pastel de Rosas de Azúcar" },
        { imagen_url: "https://i.pinimg.com/736x/b0/8f/6f/b08f6fd110b3888c13ad13c7a787de44.jpg", nombre: "Pastel de Osos" },
        { imagen_url: "https://i.pinimg.com/736x/b3/12/6c/b3126c02d3d2837f676e77d75431ea7c.jpg", nombre: "Pastel XV años de Vainilla" },
        { imagen_url: "https://i.pinimg.com/736x/2e/f1/11/2ef111518f4ad650ab07baf4f461510e.jpg", nombre: "Pastel de Barbie" }
    ];

    container.innerHTML = ejemplos.map(pastel => `
        <div class="pastel">
            <img src="${pastel.imagen_url}" alt="${pastel.nombre}">
            <p>${pastel.nombre}</p>
            <div class="icons">
                <i class="fas fa-edit"></i>
                <i class="fas fa-heart"></i>
            </div>
        </div>
    `).join('');
}


let categoriaSeleccionada = null;
        let todosLosPasteles = []; // Guardará todos los pasteles de la categoría seleccionada

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
            // Mostrar solo los primeros 4 pasteles populares
            const pasteles = todosLosPasteles.slice(0, 4);
            mostrarPasteles(pasteles);

            // Botones
            document.getElementById("mostrarMas").style.display = todosLosPasteles.length > 4 ? "block" : "none";
            document.getElementById("mostrarMenos").style.display = "none";
        }

        function mostrarTodosLosPasteles() {
            mostrarPasteles(todosLosPasteles);

            // Botones
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
                        <i class="fas fa-edit"></i>
                        <i class="fas fa-heart"></i>
                    </div>
                </div>
            `).join('');
        }

        // Eventos
        document.querySelectorAll(".categoria").forEach(boton => 
            boton.addEventListener("click", function () { 
                cargarPastelesPorCategoria(this.getAttribute("data-categoria")); 
            })
        );

        document.getElementById("mostrarMas").addEventListener("click", mostrarTodosLosPasteles);
        document.getElementById("mostrarMenos").addEventListener("click", mostrarPrimerosCuatroPasteles);