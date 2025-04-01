zzz// Mostrar contenido de la sección correspondiente
function showContent(sectionId, element) {
  // Ocultar todas las secciones
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => section.style.display = 'none');
  
  // Desmarcar todas las pestañas
  const tabs = document.querySelectorAll('.option');
  tabs.forEach(tab => tab.classList.remove('active-tab'));
  
  // Mostrar la sección seleccionada
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
      selectedSection.style.display = 'block';
  }

  // Si no estamos en "Editar Perfil", ocultamos el perfil (foto, nombre, biografía)
  if (sectionId !== "editarPerfil") {
      document.getElementById('profileSection').classList.add('hidden');
  } else {
      document.getElementById('profileSection').classList.remove('hidden');
  }

  // Marcar la pestaña como activa
  element.classList.add('active-tab');
}

// Manejar el formulario de edición
const editForm = document.getElementById('editForm');
editForm.addEventListener('submit', function (e) {
  e.preventDefault();
  
  const name = document.getElementById('editName').value.trim();
  const bio = document.getElementById('editBio').value.trim();
  const image = document.getElementById('editImage').files[0];
  
  // Verificar si los campos están completos
  if (name && bio && image) {
      // Actualizar nombre y biografía
      document.getElementById('profileName').innerText = name;
      document.getElementById('profileBio').innerText = bio;
      
      // Cambiar la imagen de perfil si se seleccionó una
      const reader = new FileReader();
      reader.onload = function (event) {
          document.getElementById('profileImage').src = event.target.result;
      };
      reader.readAsDataURL(image);
  
      // Volver a mostrar la barra de perfil
      document.getElementById('profileSection').classList.remove('hidden');
      document.getElementById('editarPerfil').style.display = 'none';
  } else {
      document.getElementById('errorMessage').style.display = 'block'; // Mostrar mensaje de error si no se completan los campos
  }
});

// Función para regresar al perfil desde la vista de edición
document.querySelector('.back-btn').addEventListener('click', function() {
  // Volver a mostrar la barra de perfil
  document.getElementById('profileSection').classList.remove('hidden');
  document.getElementById('editarPerfil').style.display = 'none';
  
  // Ocultar cualquier error de formulario al regresar
  document.getElementById('errorMessage').style.display = 'none';
});
