let scene, camera, renderer, controls, loader, cakeModel;
let selectedModel = '1_piso.fbx';
let selectedFlavor = null;
let selectedFillings = [];
let selectedDecorations = [];
const userId = localStorage.getItem('id_usuario'); // Asegurar que el usuario esté autenticado
const reposteroId = 1; // Este valor debería asignarse correctamente

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 100, 200);

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('cakeCanvas'), alpha: true });
    renderer.setSize(window.innerWidth * 0.6, window.innerHeight);
    document.querySelector('.cake-container').appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    loader = new THREE.FBXLoader();
    loadCakeModel(selectedModel);
    animate();
}

// Cargar el modelo de pastel
function loadCakeModel(modelPath) {
    selectedModel = modelPath;
    if (cakeModel) {
        scene.remove(cakeModel);
        cakeModel = null;
    }

    loader.load(`models/${modelPath}`, function (object) {
        cakeModel = object;
        cakeModel.scale.set(0.5, 0.5, 0.5);
        cakeModel.position.set(0, -50, 0);

        const newMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.3,
            roughness: 0.5
        });

        cakeModel.traverse((child) => {
            if (child.isMesh) {
                child.material = newMaterial;
            }
        });

        scene.add(cakeModel);
        updateSidebar();
    });
}

// Mostrar opciones en la sidebar
function updateSidebar() {
    const sidebar = document.getElementById("flavorsList");
    sidebar.innerHTML = `
        <h4>Capas: ${selectedModel.replace('.fbx', '')}</h4>
        <h4>Bizcocho: ${selectedFlavor || 'Ninguno'}</h4>
        <h4>Relleno: ${selectedFillings.length ? selectedFillings.join(', ') : 'Ninguno'}</h4>
        <h4>Decoraciones: ${selectedDecorations.length ? selectedDecorations.join(', ') : 'Ninguna'}</h4>
    `;
}

// Selección de Bizcocho
function showBizcocho() {
    const bizcochoList = document.getElementById("bizcochoList");
    bizcochoList.innerHTML = `
        <button onclick="setBizcocho('Chocolate', 0x8B4513)">Chocolate</button>
        <button onclick="setBizcocho('Vainilla', 0xF3E5AB)">Vainilla</button>
        <button onclick="setBizcocho('Red Velvet', 0xC71585)">Red Velvet</button>
        <button onclick="setBizcocho('Zanahoria', 0xD2691E)">Zanahoria</button>
    `;
}

function setBizcocho(tipo, color) {
    selectedFlavor = tipo;
    if (!cakeModel) return;
    cakeModel.traverse((child) => {
        if (child.isMesh && child.material) {
            child.material.color.set(color);
        }
    });
    updateSidebar();
}

// Selección de Relleno
function showRelleno() {
    const rellenoList = document.getElementById("rellenoList");
    rellenoList.innerHTML = `
        <button onclick="setRelleno('Crema')">Crema</button>
        <button onclick="setRelleno('Chocolate')">Chocolate</button>
        <button onclick="setRelleno('Dulce de leche')">Dulce de leche</button>
        <button onclick="setRelleno('Frutas')">Frutas</button>
    `;
}

function setRelleno(tipo) {
    if (!selectedFillings.includes(tipo)) {
        selectedFillings.push(tipo);
    }
    updateSidebar();
}

// Selección de Decoraciones
function showDecoraciones() {
    const decoracionesList = document.getElementById("decoracionesList");
    decoracionesList.innerHTML = `
        <button onclick="setDecoracion('Flores')">Flores</button>
        <button onclick="setDecoracion('Perlas')">Perlas</button>
        <button onclick="setDecoracion('Chispas')">Chispas</button>
        <button onclick="setDecoracion('Frutas')">Frutas</button>
    `;
}

function setDecoracion(tipo) {
    if (!selectedDecorations.includes(tipo)) {
        selectedDecorations.push(tipo);
    }
    updateSidebar();
}

// Reiniciar pastel
function resetCake() {
    selectedFlavor = null;
    selectedFillings = [];
    selectedDecorations = [];
    loadCakeModel('1_piso.fbx');
}

// Guardar pastel en la base de datos
function saveCake() {
    if (!userId) {
        alert("Debes iniciar sesión para guardar tu pastel.");
        return;
    }

    if (!selectedFlavor || selectedFillings.length === 0 || selectedDecorations.length === 0) {
        alert("Completa el diseño del pastel antes de guardarlo.");
        return;
    }

    const precioBase = 25.00; // Precio base del pastel
    const precioFinal = precioBase + (selectedFillings.length * 5) + (selectedDecorations.length * 3);

    const cakeData = {
        id_usuario: parseInt(userId),
        id_repostero: reposteroId,
        Bizcocho: selectedFlavor,
        Relleno: selectedFillings.join(', '),
        Decoraciones: JSON.stringify(selectedDecorations),
        Precio: precioFinal
    };

    if (confirm("¿Deseas guardar tu pastel?")) {
        fetch("http://localhost:3000/api/PastelPersonalizado/crearpastelPersonalizado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cakeData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Pastel guardado con éxito.");
                resetCake();
            } else {
                alert("Hubo un problema al guardar el pastel.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error al guardar el pastel.");
        });
    }
}

// Animación
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.onload = init;
