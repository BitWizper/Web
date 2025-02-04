document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.getElementById("menu");
    const dropdownMenu = document.getElementById("dropdownMenu");

    menuIcon.addEventListener("click", function (event) {
        event.stopPropagation(); // Evita que el clic cierre el menú inmediatamente
        dropdownMenu.style.display = dropdownMenu.style.display === "flex" ? "none" : "flex";
    });

    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener("click", function (event) {
        if (!dropdownMenu.contains(event.target) && event.target !== menuIcon) {
            dropdownMenu.style.display = "none";
        }
    });
});
