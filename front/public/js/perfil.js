// Mostrar contenido del formulario de edición
function showContent(sectionId) {
  // Ocultar todas las secciones
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => section.style.display = 'none');
  
  // Ocultar la barra de perfil y la imagen cuando se edite
  document.getElementById('profileSection').classList.add('hidden');
  
  // Mostrar la sección seleccionada
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
      selectedSection.style.display = 'block';
  }
}

// Manejar el formulario de edición
const editForm = document.getElementById('editForm');
editForm.addEventListener('submit', function (e) {
  e.preventDefault();
  
  const name = document.getElementById('editName').value;
  const bio = document.getElementById('editBio').value;
  const image = document.getElementById('editImage').files[0];
  
  if (name && bio && image) {
      // Actualizar nombre y biografía
      document.getElementById('profileName').innerText = name;
      document.getElementById('profileBio').innerText = bio;
      
      // Cambiar la imagen de perfil
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
});


