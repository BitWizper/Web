// Función para iniciar sesión
async function iniciarSesion(event) {
    event.preventDefault();
    console.log("Formulario de login enviado");
  
    // Recopila los datos del formulario
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;
  
    try {
      // Realiza la solicitud al servidor
      const response = await fetch("http://localhost:3000/api/usuario/loginuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, contrasena }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Guarda el token en localStorage
        localStorage.setItem("token", data.token);
  
        // Decodifica el token para verificar la expiración
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        const expDate = new Date(payload.exp * 1000); // Convierte UNIX a fecha legible
        console.log("Token expirará en:", expDate);
  
        alert("Inicio de sesión exitoso");
        window.location.href = "/Pasteleros/components/menu.html"; // Redirige al usuario
      } else {
        alert(data.error || "Correo o contraseña incorrectos.");
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      alert("Hubo un problema al conectar con el servidor.");
    }
  }
  
  // Función para verificar el token y si está expirado
  function verificarToken() {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("No estás autenticado. Por favor inicia sesión.");
      window.location.href = "login.html";
      return false;
    }
  
    try {
      // Decodifica el token para verificar si ha expirado
      const payload = JSON.parse(atob(token.split(".")[1]));
      const ahora = Math.floor(Date.now() / 1000);
  
      // Si el token ha expirado
      if (payload.exp < ahora) {
        alert("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
        localStorage.removeItem("token");
        window.location.href = "login.html"; // Redirige a login si el token ha expirado
        return false;
      }
  
      console.log("Token válido. Usuario autenticado:", payload);
      return true;
    } catch (error) {
      console.error("Error al verificar el token:", error);
      alert("Token inválido. Por favor inicia sesión.");
      localStorage.removeItem("token");
      window.location.href = "login.html"; // Redirige a login si hay un problema con el token
      return false;
    }
  }
  
  // Verificación periódica del token
  function iniciarVerificacionPeriodica() {
    setInterval(() => {
      const token = localStorage.getItem("token");
  
      if (token) {
        try {
          // Decodifica el token para verificar si ha expirado
          const payload = JSON.parse(atob(token.split(".")[1]));
          const ahora = Math.floor(Date.now() / 1000);
  
          if (payload.exp < ahora) {
            alert("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
            localStorage.removeItem("token");
            window.location.href = "login.html"; // Redirige al login
          }
        } catch (error) {
          console.error("Error al verificar el token periódicamente:", error);
          alert("Token inválido. Por favor inicia sesión.");
          localStorage.removeItem("token");
          window.location.href = "login.html";
        }
      }
    }, 5000); // Verifica cada 5 segundos
  }
  
  // Función para cerrar sesión
  function cerrarSesion() {
    localStorage.removeItem("token");
    alert("Has cerrado sesión.");
    window.location.href = "login.html";
  }
  
  // Verificar el token automáticamente al cargar páginas protegidas
  if (!window.location.pathname.includes("login.html")) {
    if (verificarToken()) {
      iniciarVerificacionPeriodica(); // Inicia la verificación periódica si el token es válido
    }
  }
  
  // Agregar el event listener al formulario de inicio de sesión
  document.getElementById("loginForm")?.addEventListener("submit", iniciarSesion);
  