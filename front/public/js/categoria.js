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

async function cargarImagenesEjemplo() {
    const container = document.getElementById("pastelesContainer");
    if (!container) return;

    try {
        const response = await fetch('http://localhost:3000/api/pastel/obtenerpasteles');
        const pasteles = await response.json();

        // Definir las categorías
        const categorias = [
            { id: 1, nombre: "XV Años" },
            { id: 2, nombre: "Cumpleaños" },
            { id: 3, nombre: "Baby Shower" },
            { id: 4, nombre: "Bodas" },
            { id: 5, nombre: "Bautizos" }
        ];

        // Obtener pasteles destacados (5 estrellas) por cada categoría
        const pastelesDestacados = categorias.map(categoria => {
            // Filtrar pasteles por categoría y popularidad = 5
            const pastelCategoria = pasteles.find(pastel => 
                parseInt(pastel.id_categoria) === categoria.id && 
                parseInt(pastel.popularidad) === 5
            );

            if (pastelCategoria) {
                // Asegurarse de que el precio sea un número
                pastelCategoria.precio = parseFloat(pastelCategoria.precio) || 0;
                return pastelCategoria;
            }

            // Pastel por defecto si no se encuentra uno destacado
            return {
                id_pastel: categoria.id,
                nombre: `Pastel de ${categoria.nombre}`,
                imagen_url: "../img/repostera1.jpg",
                descripcion: `Pastel destacado para ${categoria.nombre}`,
                precio: 0,
                popularidad: 5
            };
        });

        container.innerHTML = pastelesDestacados.map(pastel => {
            // Asegurarse de que el precio sea un número antes de usar toFixed
            const precio = typeof pastel.precio === 'number' ? 
                          pastel.precio.toFixed(2) : 
                          parseFloat(pastel.precio || 0).toFixed(2);

            return `
                <div class="pastel" data-id="${pastel.id_pastel}">
                    <img src="${pastel.imagen_url || '../img/repostera1.jpg'}" 
                         alt="${pastel.nombre}"
                         onerror="this.src='../img/repostera1.jpg'">
                    <div class="icons">
                        <i class="fas fa-edit" data-id="${pastel.id_pastel}"></i>
                        <i class="fas fa-heart ${isFavorito(pastel.id_pastel) ? 'favorito' : ''}" 
                           data-id="${pastel.id_pastel}"></i>
                    </div>
                    <h3>${pastel.nombre}</h3>
                    <p>${pastel.descripcion || 'Pastel destacado'}</p>
                    <div class="stars">
                        ${'★'.repeat(5)}
                    </div>
                    <div class="price">$${precio}</div>
                    <button class="btn-agregar-carrito" onclick="addToCart({
                        id: ${pastel.id_pastel},
                        nombre: '${pastel.nombre.replace(/'/g, "\\'")}',
                        precio: ${precio},
                        imagen: '${pastel.imagen_url || '../img/repostera1.jpg'}',
                        cantidad: 1
                    })">
                        Añadir al carrito
                    </button>
                </div>
            `;
        }).join('');

        if (typeof asignarEventosFavoritos === 'function') {
            asignarEventosFavoritos();
        }
        if (typeof asignarEventosEdicion === 'function') {
            asignarEventosEdicion();
        }

    } catch (error) {
        console.error("Error al cargar los pasteles destacados:", error);
        container.innerHTML = '<p>Error al cargar los pasteles destacados</p>';
    }
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
const PASTELES_POR_PAGINA = 4; // Número de pasteles a mostrar inicialmente

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
        
        // Mostrar solo los primeros pasteles
        mostrarPrimerosCuatroPasteles();

        // Asignar eventos a los botones
        const btnMostrarMas = document.getElementById("mostrarMas");
        const btnMostrarMenos = document.getElementById("mostrarMenos");
        
        if (btnMostrarMas) {
            btnMostrarMas.onclick = mostrarTodosLosPasteles;
        }
        if (btnMostrarMenos) {
            btnMostrarMenos.onclick = mostrarPrimerosCuatroPasteles;
        }

    } catch (error) {
        console.error("Error al cargar los pasteles:", error);
        alert("Error al cargar los pasteles");
    }
}

function mostrarPrimerosCuatroPasteles() {
    const pastelesMostrar = todosLosPasteles.slice(0, PASTELES_POR_PAGINA);
    mostrarPasteles(pastelesMostrar);
    
    const btnMostrarMas = document.getElementById("mostrarMas");
    const btnMostrarMenos = document.getElementById("mostrarMenos");
    
    if (btnMostrarMas) {
        btnMostrarMas.style.display = todosLosPasteles.length > PASTELES_POR_PAGINA ? "block" : "none";
    }
    if (btnMostrarMenos) {
        btnMostrarMenos.style.display = "none";
    }
}

function mostrarTodosLosPasteles() {
    mostrarPasteles(todosLosPasteles);
    
    const btnMostrarMas = document.getElementById("mostrarMas");
    const btnMostrarMenos = document.getElementById("mostrarMenos");
    
    if (btnMostrarMas) {
        btnMostrarMas.style.display = "none";
    }
    if (btnMostrarMenos) {
        btnMostrarMenos.style.display = "block";
    }
}

function mostrarPasteles(pasteles) {
    const container = document.getElementById("pastelesContainer");
    container.innerHTML = pasteles.map(pastel => {
        const precio = typeof pastel.precio === 'number' ? 
                      pastel.precio.toFixed(2) : 
                      parseFloat(pastel.precio || 0).toFixed(2);

        return `
            <div class="pastel" data-id="${pastel.id_pastel}">
                <img src="${pastel.imagen_url || '../img/repostera1.jpg'}" 
                     alt="${pastel.nombre}"
                     onerror="this.src='../img/repostera1.jpg'">
                <div class="icons">
                    <i class="fas fa-edit" data-id="${pastel.id_pastel}"></i>
                    <i class="fas fa-heart ${isFavorito(pastel.id_pastel) ? 'favorito' : ''}" 
                       data-id="${pastel.id_pastel}"></i>
                </div>
                <h3>${pastel.nombre}</h3>
                <p>${pastel.descripcion || 'Pastel destacado'}</p>
                <div class="stars">
                    ${'★'.repeat(pastel.popularidad || 0)}
                </div>
                <div class="price">$${precio}</div>
                <button class="btn-agregar-carrito" onclick="addToCart({
                    id: ${pastel.id_pastel},
                    nombre: '${pastel.nombre.replace(/'/g, "\\'")}',
                    precio: ${precio},
                    imagen: '${pastel.imagen_url || '../img/repostera1.jpg'}',
                    cantidad: 1
                })">
                    Añadir al carrito
                </button>
            </div>
        `;
    }).join('');

    // Agregar botones mostrar más/menos si no existen
    const section = container.closest('section');
    if (section && !document.getElementById("mostrarMas")) {
        const botonesHTML = `
            <button id="mostrarMas" class="mostrar-mas">Mostrar más</button>
            <button id="mostrarMenos" class="mostrar-mas">Mostrar menos</button>
        `;
        section.insertAdjacentHTML('beforeend', botonesHTML);
        
        // Asignar eventos a los botones
        document.getElementById("mostrarMas").onclick = mostrarTodosLosPasteles;
        document.getElementById("mostrarMenos").onclick = mostrarPrimerosCuatroPasteles;
    }

    // Asignar eventos
    if (typeof asignarEventosFavoritos === 'function') {
        asignarEventosFavoritos();
    }
    if (typeof asignarEventosEdicion === 'function') {
        asignarEventosEdicion();
    }
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

function agregarAlCarrito(pastel) {
    try {
        // Obtener el carrito actual del localStorage
        let carrito = [];
        const carritoGuardado = localStorage.getItem('carrito');
        
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
        }
        
        // Verificar si el pastel ya está en el carrito
        const pastelExistente = carrito.find(item => item.id === pastel.id);
        
        if (pastelExistente) {
            // Si el pastel ya está en el carrito, aumentar la cantidad
            pastelExistente.cantidad += 1;
        } else {
            // Asegurarse de que todos los campos necesarios estén presentes
            const nuevoPastel = {
                id: pastel.id,
                nombre: pastel.nombre,
                precio: parseFloat(pastel.precio),
                imagen: pastel.imagen,
                cantidad: 1,
                // Agregar campos adicionales si son necesarios para tu carrito
                descripcion: pastel.descripcion || ''
            };
            carrito.push(nuevoPastel);
        }
        
        // Guardar el carrito actualizado
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Mostrar mensaje de confirmación
        mostrarMensaje('¡Pastel agregado al carrito!');
        
        // Actualizar el contador del carrito
        actualizarContadorCarrito();
        
        // Log para debugging
        console.log('Carrito actualizado:', carrito);
        
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        mostrarMensaje('Error al agregar al carrito');
    }
}

function mostrarMensaje(mensaje) {
    // Eliminar mensaje anterior si existe
    const mensajeAnterior = document.querySelector('.mensaje-carrito');
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }

    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'mensaje-carrito';
    mensajeDiv.textContent = mensaje;
    document.body.appendChild(mensajeDiv);

    // Eliminar el mensaje después de 2 segundos
    setTimeout(() => {
        mensajeDiv.remove();
    }, 2000);
}

function actualizarContadorCarrito() {
    try {
        const carritoGuardado = localStorage.getItem('carrito');
        const carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
        
        // Actualizar el contador en el ícono del carrito
        const contadorElement = document.querySelector('.cart-count');
        if (contadorElement) {
            const totalItems = carrito.reduce((total, item) => total + (item.cantidad || 0), 0);
            contadorElement.textContent = totalItems;
            // Hacer visible el contador
            contadorElement.style.display = totalItems > 0 ? 'block' : 'none';
        }
        
        // Log para debugging
        console.log('Contador actualizado:', carrito.length);
        
    } catch (error) {
        console.error('Error al actualizar contador:', error);
    }
}

// Agregar evento para cargar el contador al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarContadorCarrito();
});

function cargarImagenesCategoria(categoria) {
    fetch('http://localhost:3000/api/pastel/obtenerpasteles')
        .then(response => response.json())
        .then(pasteles => {
            const contenedor = document.querySelector('#pastelesContainer');
            contenedor.innerHTML = '';

            // Filtrar pasteles por categoría
            const pastelesFiltrados = pasteles.filter(pastel => pastel.categoria === categoria);

            pastelesFiltrados.forEach(pastel => {
                const pastelDiv = document.createElement('div');
                pastelDiv.className = 'pastel';
                pastelDiv.setAttribute('data-id', pastel.id);
                pastelDiv.innerHTML = `
                    <img src="${pastel.imagen || 'ruta/imagen/default.jpg'}" 
                         alt="${pastel.nombre}" 
                         onerror="this.src='ruta/imagen/default.jpg'">
                    <div class="icons">
                        <i class="fas fa-edit"></i>
                        <i class="fas fa-heart"></i>
                    </div>
                    <h3>${pastel.nombre}</h3>
                    <p>${pastel.descripcion}</p>
                    <div class="stars">★★★★★</div>
                    <div class="price">$${pastel.precio.toFixed(2)}</div>
                    <button class="boton-carrito">Añadir al carrito</button>
                `;
                contenedor.appendChild(pastelDiv);
            });

            // Agregar botones de mostrar más/menos
            const botonesContainer = document.createElement('div');
            botonesContainer.innerHTML = `
                <button id="mostrarMas" class="mostrar-mas" style="display: none;">Mostrar más</button>
                <button id="mostrarMenos" class="mostrar-mas" style="display: none;">Mostrar menos</button>
            `;
            contenedor.parentElement.appendChild(botonesContainer);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Event listeners para los botones de categoría
document.addEventListener('DOMContentLoaded', () => {
    const categorias = ['XV Años', 'Cumpleaños', 'Baby Shower', 'Boda', 'Bautizo'];
    
    categorias.forEach(categoria => {
        const boton = document.querySelector(`[data-categoria="${categoria}"]`);
        if (boton) {
            boton.addEventListener('click', () => cargarImagenesCategoria(categoria));
        }
    });
});
