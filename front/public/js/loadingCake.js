document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menu');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const userId = localStorage.getItem('id_usuario');

    // Función para verificar si el usuario está autenticado
    function isAuthenticated() {
        return !!userId;
    }

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
        const excludedIds = ['menu', 'dropdownMenu', 'loginDialog'];
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
        
        if (!isAuthenticated() && !shouldBeExcluded(clickedElement)) {
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
}); 