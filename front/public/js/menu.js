// Función para verificar el inicio de sesión
function checkLogin() {
    const userId = localStorage.getItem('id_usuario');
    if (!userId) {
        alert("Debes iniciar sesión para acceder a esta función");
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", async function () {
    const menuIcon = document.getElementById("menu");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const userId = localStorage.getItem('id_usuario');
    const slider = document.getElementById("slider");

    // Función para cargar los pasteles destacados
    async function cargarPastelesDestacados() {
        try {
            const response = await fetch('http://localhost:3000/api/pastel/obtenerpasteles');
            const pasteles = await response.json();

            // Filtrar pasteles con popularidad > 4
            const pastelesDestacados = pasteles.filter(pastel => pastel.popularidad > 4);

            // Limpiar el contenedor del slider
            slider.innerHTML = '';

            // Agregar cada pastel destacado al slider
            pastelesDestacados.forEach(pastel => {
                const cakeBox = document.createElement('div');
                cakeBox.className = 'carousel-box';
                cakeBox.innerHTML = `
                    <img src="${pastel.imagen_url}" 
                         onerror="this.onerror=null; this.src='https://i.pinimg.com/736x/8d/4d/20/8d4d20b75a8d8b13e3d2907c5c58e633.jpg';" 
                         alt="${pastel.nombre}">
                    <h3>${pastel.nombre}</h3>
                    <p>${pastel.descripcion || 'Delicioso pastel artesanal'}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
                        <span style="color: #731D3C; font-weight: bold;">$${pastel.precio}</span>
                        <span style="color: gold;">
                            ${'★'.repeat(Math.floor(pastel.popularidad))}
                            ${pastel.popularidad % 1 !== 0 ? '½' : ''}
                        </span>
                    </div>
                    <div style="color: #666; font-size: 0.9em; text-align: right;">
                        Categoría: ${pastel.categoria || 'General'}
                    </div>
                `;

                // Agregar evento click al pastel (requerirá login)
                cakeBox.addEventListener('click', (e) => {
                    if (!userId) {
                        e.preventDefault();
                        showLoginDialog();
                    }
                });

                slider.appendChild(cakeBox);
            });

        } catch (error) {
            console.error('Error al cargar los pasteles destacados:', error);
        }
    }

    // Cargar los pasteles destacados al inicio
    await cargarPastelesDestacados();

    // Función para mostrar el diálogo de login
    function showLoginDialog() {
        const dialogHTML = `
            <div id="loginDialog" style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            ">
                <div style="
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    max-width: 300px;
                    width: 90%;
                ">
                    <h3 style="color: #731D3C; margin-bottom: 20px;">Debes iniciar sesión</h3>
                    <div style="display: flex; justify-content: center; gap: 10px;">
                        <button onclick="closeLoginDialog()" style="
                            padding: 8px 20px;
                            border: none;
                            border-radius: 4px;
                            background: #A65168;
                            color: white;
                            cursor: pointer;
                        ">Cancelar</button>
                        <button onclick="redirectToLogin()" style="
                            padding: 8px 20px;
                            border: none;
                            border-radius: 4px;
                            background: #731D3C;
                            color: white;
                            cursor: pointer;
                        ">Aceptar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', dialogHTML);
    }

    // Funciones para el diálogo de login
    window.closeLoginDialog = function() {
        const dialog = document.getElementById('loginDialog');
        if (dialog) dialog.remove();
    };

    window.redirectToLogin = function() {
        window.location.href = '../index.html';
    };

    // Verificar elementos excluidos
    function shouldBeExcluded(element) {
        const excludedIds = ['menu', 'dropdownMenu', 'loginDialog', 'prevBtn', 'nextBtn'];
        const excludedHrefs = ['index.html', '../index.html', 'home.html', '/components/home.html'];
        
        if (element.id && excludedIds.includes(element.id)) return true;
        
        if (element.tagName === 'A') {
            const href = element.getAttribute('href');
            if (href && excludedHrefs.some(excluded => href.includes(excluded))) return true;
        }
        
        return false;
    }

    // Manejar clics en el documento
    document.addEventListener('click', function(e) {
        const clickedElement = e.target;
        
        if (!userId && !shouldBeExcluded(clickedElement)) {
            e.preventDefault();
            e.stopPropagation();
            showLoginDialog();
        }
    });

    // Funcionalidad del menú
    menuIcon.addEventListener("click", function (event) {
        event.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === "flex" ? "none" : "flex";
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", function (event) {
        if (!dropdownMenu.contains(event.target) && event.target !== menuIcon) {
            dropdownMenu.style.display = "none";
        }
    });

    // Mantener la funcionalidad del slider
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    
    prevBtn.addEventListener("click", () => {
        slider.scrollLeft -= 300;
    });
    
    nextBtn.addEventListener("click", () => {
        slider.scrollLeft += 300;
    });
});
