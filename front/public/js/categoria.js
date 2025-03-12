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