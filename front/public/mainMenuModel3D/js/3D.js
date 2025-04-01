// Variables globales
let scene, camera, renderer, controls, loader, cakeModel;
let selectedModel = '1_piso.fbx';
let selectedFlavor = null;
let selectedFillings = [];
let selectedDecorations = [];
const userId = localStorage.getItem('id_usuario') || 1; // Temporal para pruebas
const reposteroId = 1;

let flowerModels = {};
let loadedCakes = [];

// Configuración de sabores, rellenos y decoraciones
const SABORES_BIZCOCHO = [
    'Vainilla', 'Chocolate', 'Red Velvet', 'Zanahoria', 
    'Mármol', 'Limón', 'Naranja', 'Almendra'
];

const RELLENOS_DISPONIBLES = [
    'Crema de Vainilla', 'Ganache de Chocolate', 'Dulce de Leche', 
    'Crema de Fresa', 'Mermelada de Frambuesa', 'Crema de Limón', 
    'Nutella', 'Crema de Café'
];

const DECORACIONES_DISPONIBLES = [
    'Flores de Azúcar', 'Flores Naturales', 'Flores de Fondant'
];

const SABORES_COLORES = {
    'Vainilla': 0xFFF8DC,
    'Chocolate': 0x3C1321,
    'Red Velvet': 0x960018,
    'Zanahoria': 0xFFA07A,
    'Mármol': { primary: 0xFFF8DC, secondary: 0x3C1321 },
    'Limón': 0xFFFACD,
    'Naranja': 0xFFB347,
    'Almendra': 0xFFE4C4
};

// Inicialización de Three.js
function init() {
    // Escena
    scene = new THREE.Scene();
    scene.background = null;
    
    // Cámara
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 150, 300);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('cakeCanvas'), 
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth * 0.7, window.innerHeight);
    renderer.shadowMap.enabled = true;
    
    // Controles
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 200;
    controls.maxDistance = 500;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI/2;
    controls.target.set(0, 50, 0);
    controls.rotateSpeed = 0.5;

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Loader
    loader = new THREE.FBXLoader();
    
    // Cargar modelo inicial
    loadCakeModel(selectedModel);
    
    // Animación
    animate();

    // Info de selecciones
    createSelectionsInfo();
    
    // Cargar pasteles guardados
    loadCakesFromDatabase();
}

// Cargar pasteles desde la base de datos
function loadCakesFromDatabase() {
    // Simulación de datos - en producción usar fetch a tu API
    setTimeout(() => {
        loadedCakes = [
            {
                id: 1,
                Bizcocho: 'Chocolate',
                Relleno: 'Ganache de Chocolate, Crema de Café',
                Decoraciones: '["Flores de Fondant"]',
                Precio: 35.00
            },
            {
                id: 2,
                Bizcocho: 'Vainilla',
                Relleno: 'Crema de Vainilla, Mermelada de Frambuesa',
                Decoraciones: '["Flores de Azúcar"]',
                Precio: 32.00
            }
        ];
        updateCakeSelectionUI();
    }, 500);
}

// Actualizar UI de selección de pasteles
function updateCakeSelectionUI() {
    const cakeSelection = document.getElementById('cakeSelection');
    if (cakeSelection) {
        cakeSelection.innerHTML = loadedCakes.map(cake => `
            <div class="cake-option" onclick="loadSavedCake(${cake.id})">
                <h4>Pastel #${cake.id}</h4>
                <p><strong>Bizcocho:</strong> ${cake.Bizcocho}</p>
                <p><strong>Relleno:</strong> ${cake.Relleno}</p>
                <p><strong>Precio:</strong> $${cake.Precio.toFixed(2)}</p>
            </div>
        `).join('');
    }
}

// Cargar un pastel guardado
function loadSavedCake(cakeId) {
    const cake = loadedCakes.find(c => c.id === cakeId);
    if (!cake) return;

    // Determinar modelo basado en decoraciones
    const hasFlowers = cake.Decoraciones.includes('Flores');
    const numFloors = hasFlowers ? 
        (cake.Decoraciones.match(/Flores/g) || []).length : 1;
    
    selectedModel = `${numFloors}_pisos.fbx`;
    selectedFlavor = cake.Bizcocho;
    selectedFillings = cake.Relleno.split(', ');
    selectedDecorations = JSON.parse(cake.Decoraciones);

    // Cargar modelo base
    loadCakeModel(selectedModel);

    // Cargar decoraciones si existen
    if (hasFlowers) {
        for (let i = 1; i <= numFloors; i++) {
            setTimeout(() => {
                loadFlowerModel(`flores_${numFloors}pisos.fbx`, i);
            }, 500 * i);
        }
    }

    updateSelectionsInfo();
    showCapas();
}

// Crear elemento para mostrar selecciones
function createSelectionsInfo() {
    const cakeContainer = document.querySelector('.cake-container');
    const selectionsInfo = document.createElement('div');
    selectionsInfo.id = 'selectionsInfo';
    selectionsInfo.style.cssText = `
        position: absolute;
        top: 20px;
        left: 20px;
        background: rgba(255, 255, 255, 0.9);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        color: #2C1810;
        max-width: 250px;
    `;
    cakeContainer.appendChild(selectionsInfo);
    updateSelectionsInfo();
}

// Actualizar información de selecciones
function updateSelectionsInfo() {
    const selectionsInfo = document.getElementById('selectionsInfo');
    if (selectionsInfo) {
        selectionsInfo.innerHTML = `
            <h4>Capas: ${selectedModel.replace('.fbx', '').replace('_', ' ')}</h4>
            <h4>Bizcocho: ${selectedFlavor || 'Ninguno'}</h4>
            <h4>Relleno: ${selectedFillings.length ? selectedFillings.join(', ') : 'Ninguno'}</h4>
            <h4>Decoraciones: ${selectedDecorations.length ? selectedDecorations.join(', ') : 'Ninguna'}</h4>
        `;
    }
}

// Cargar modelo de pastel
function loadCakeModel(modelPath) {
    selectedModel = modelPath;
    
    // Eliminar modelo anterior si existe
    if (cakeModel) {
        scene.remove(cakeModel);
        cakeModel = null;
    }

    loader.load(`models/${modelPath}`, function (object) {
        cakeModel = object;
        cakeModel.scale.set(0.5, 0.5, 0.5);
        cakeModel.position.set(0, 0, 0);
        cakeModel.castShadow = true;
        cakeModel.receiveShadow = true;

        // Aplicar color según sabor seleccionado
        if (selectedFlavor) {
            const color = SABORES_COLORES[selectedFlavor];
            if (selectedFlavor === 'Mármol') {
                applyMarbleTexture();
            } else {
                applySolidColor(color);
            }
        } else {
            // Color por defecto
            const defaultMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.3,
                roughness: 0.5
            });
            cakeModel.traverse((child) => {
                if (child.isMesh) {
                    child.material = defaultMaterial;
                }
            });
        }

        scene.add(cakeModel);
        
        // Ajustar cámara al modelo
        const box = new THREE.Box3().setFromObject(cakeModel);
        const center = box.getCenter(new THREE.Vector3());
        controls.target.copy(center);
        controls.update();

        updateSelectionsInfo();
    }, undefined, function (error) {
        console.error('Error loading model:', error);
    });
}

// Aplicar color sólido
function applySolidColor(color) {
    const newMaterial = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.1,
        roughness: 0.7,
    });

    cakeModel.traverse((child) => {
        if (child.isMesh) {
            child.material = newMaterial;
        }
    });
}

// Aplicar textura de mármol
function applyMarbleTexture() {
    const marbleColors = SABORES_COLORES['Mármol'];
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Fondo primario
    ctx.fillStyle = `#${marbleColors.primary.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Vetas secundarias
    ctx.strokeStyle = `#${marbleColors.secondary.toString(16).padStart(6, '0')}`;
    ctx.lineWidth = 3;
    for (let i = 0; i < 15; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
            x + 50, y - 50,
            x + 100, y + 50,
            x + 150, y
        );
        ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.1,
        roughness: 0.7
    });

    cakeModel.traverse((child) => {
        if (child.isMesh) {
            child.material = material;
        }
    });
}

// Cargar modelo de flores
function loadFlowerModel(modelPath, floorNumber) {
    // Eliminar flores existentes en este piso
    if (flowerModels[floorNumber]) {
        scene.remove(flowerModels[floorNumber]);
        delete flowerModels[floorNumber];
    }
    
    loader.load(`models/${modelPath}`, function (object) {
        const flowerModel = object;
        const numFloors = parseInt(selectedModel.charAt(0));
        
        // Ajustar escala
        const baseScale = 0.5;
        const scaleMultiplier = 1 - ((numFloors - 1) * 0.15);
        flowerModel.scale.set(
            baseScale * scaleMultiplier,
            baseScale * scaleMultiplier,
            baseScale * scaleMultiplier
        );
        
        // Posicionar según el piso
        const pisoHeight = 30;
        const radioBase = 20;
        const reduccionRadio = 0.14;
        const radioActual = radioBase * (1 - ((numFloors - floorNumber) * reduccionRadio));
        const yPosition = (floorNumber - 1) * pisoHeight;
        
        flowerModel.position.set(0, yPosition, radioActual);
        
        // Grupo para rotación sincronizada
        const flowerGroup = new THREE.Group();
        flowerGroup.add(flowerModel);
        
        // Sincronizar rotación con el pastel
        const updateFlowerPosition = () => {
            if (flowerGroup && cakeModel) {
                flowerGroup.rotation.y = cakeModel.rotation.y;
            }
        };
        
        controls.addEventListener('change', updateFlowerPosition);
        scene.add(flowerGroup);
        flowerModels[floorNumber] = flowerGroup;
        
        updateSelectionsInfo();
    });
}

// Mostrar diálogo de selección de piso para flores
function showFloorSelectionDialog(numPisos) {
    const dialog = document.createElement('div');
    dialog.className = 'floor-dialog';
    dialog.innerHTML = `
        <h3>Selecciona el piso para las flores</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            ${Array.from({length: numPisos}, (_, i) => i + 1).map(piso => `
                <button onclick="loadFlowerModel('flores_${numPisos}pisos.fbx', ${piso}); this.parentElement.parentElement.remove()">
                    Piso ${piso}
                </button>
            `).join('')}
            <button class="cancel" onclick="this.parentElement.parentElement.remove()">
                Cancelar
            </button>
        </div>
    `;
    
    document.body.appendChild(dialog);
}

// Funciones de UI
function showSavedCakes() {
    document.getElementById('sidebarTitle').textContent = 'Mis Pasteles';
    hideAllOptions();
    document.getElementById('cakeSelection').style.display = 'block';
}

function showCapas() {
    document.getElementById('sidebarTitle').textContent = 'Capas del Pastel';
    hideAllOptions();
    
    const capasOptions = document.getElementById('capasOptions');
    capasOptions.style.display = 'block';
    capasOptions.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            ${[1, 2, 3, 4].map(num => `
                <button class="option-button ${selectedModel === `${num}_pisos.fbx` ? 'active' : ''}" 
                        onclick="loadCakeModel('${num}_pisos.fbx')">
                    ${num} ${num === 1 ? 'Piso' : 'Pisos'}
                </button>
            `).join('')}
        </div>
    `;
}

function showBizcocho() {
    document.getElementById('sidebarTitle').textContent = 'Bizcocho';
    hideAllOptions();
    
    const bizcochoList = document.getElementById('bizcochoList');
    bizcochoList.style.display = 'block';
    bizcochoList.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            ${SABORES_BIZCOCHO.map(sabor => `
                <button class="option-button ${selectedFlavor === sabor ? 'active' : ''}" 
                        onclick="selectFlavor('${sabor}')">
                    ${sabor}
                </button>
            `).join('')}
        </div>
    `;
}

function selectFlavor(flavor) {
    selectedFlavor = flavor;
    updateSelectionsInfo();
    
    // Actualizar botones activos
    const buttons = document.querySelectorAll('#bizcochoList button');
    buttons.forEach(button => {
        button.classList.toggle('active', button.textContent.trim() === flavor);
    });

    // Aplicar color al modelo
    if (cakeModel) {
        const color = SABORES_COLORES[flavor];
        if (flavor === 'Mármol') {
            applyMarbleTexture();
        } else {
            applySolidColor(color);
        }
    }
}

function showRelleno() {
    document.getElementById('sidebarTitle').textContent = 'Relleno';
    hideAllOptions();
    
    const rellenoList = document.getElementById('rellenoList');
    rellenoList.style.display = 'block';
    rellenoList.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            ${RELLENOS_DISPONIBLES.map(relleno => `
                <button class="option-button ${selectedFillings.includes(relleno) ? 'active' : ''}" 
                        onclick="selectFilling('${relleno}')">
                    ${relleno}
                </button>
            `).join('')}
        </div>
    `;
}

function selectFilling(filling) {
    if (selectedFillings.includes(filling)) {
        selectedFillings = selectedFillings.filter(f => f !== filling);
    } else if (selectedFillings.length < 2) {
        selectedFillings.push(filling);
    } else {
        alert('Solo puedes seleccionar hasta 2 rellenos');
        return;
    }
    
    updateSelectionsInfo();
    
    // Actualizar botones activos
    const buttons = document.querySelectorAll('#rellenoList button');
    buttons.forEach(button => {
        button.classList.toggle('active', selectedFillings.includes(button.textContent.trim()));
    });
}

function showDecoraciones() {
    document.getElementById('sidebarTitle').textContent = 'Decoraciones';
    hideAllOptions();
    
    const decoracionesList = document.getElementById('decoracionesList');
    decoracionesList.style.display = 'block';
    decoracionesList.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            ${DECORACIONES_DISPONIBLES.map(decoracion => `
                <button class="option-button ${selectedDecorations.includes(decoracion) ? 'active' : ''}" 
                        onclick="selectDecoration('${decoracion}')">
                    ${decoracion}
                </button>
            `).join('')}
        </div>
    `;
}

function selectDecoration(decoration) {
    if (decoration === 'Flores de Fondant') {
        const numPisos = parseInt(selectedModel.charAt(0));
        if (numPisos === 1) {
            loadFlowerModel('flores_1pisos.fbx', 1);
        } else {
            showFloorSelectionDialog(numPisos);
        }
    }
    
    if (selectedDecorations.includes(decoration)) {
        selectedDecorations = selectedDecorations.filter(d => d !== decoration);
    } else {
        selectedDecorations.push(decoration);
    }
    
    updateSelectionsInfo();
    
    // Actualizar botones activos
    const buttons = document.querySelectorAll('#decoracionesList button');
    buttons.forEach(button => {
        button.classList.toggle('active', selectedDecorations.includes(button.textContent.trim()));
    });
}

function hideAllOptions() {
    document.getElementById('cakeSelection').style.display = 'none';
    document.getElementById('capasOptions').style.display = 'none';
    document.getElementById('bizcochoList').style.display = 'none';
    document.getElementById('rellenoList').style.display = 'none';
    document.getElementById('decoracionesList').style.display = 'none';
}

// Guardar pastel
function saveCake() {
    if (!selectedFlavor || selectedFillings.length === 0 || selectedDecorations.length === 0) {
        alert("Completa el diseño del pastel antes de guardarlo.");
        return;
    }

    const precioBase = 25.00;
    const precioFinal = precioBase + (selectedFillings.length * 5) + (selectedDecorations.length * 3);

    const cakeData = {
        id_usuario: parseInt(userId),
        id_repostero: reposteroId,
        Bizcocho: selectedFlavor,
        Relleno: selectedFillings.join(', '),
        Decoraciones: JSON.stringify(selectedDecorations),
        Precio: precioFinal,
        modelo_3d: selectedModel
    };

    if (confirm("¿Deseas guardar tu pastel?")) {
        // Simulación de guardado - en producción usar fetch a tu API
        console.log("Guardando pastel:", cakeData);
        setTimeout(() => {
            alert("Pastel guardado con éxito.");
            loadCakesFromDatabase(); // Recargar lista de pasteles
        }, 1000);
    }
}

// Reiniciar diseño
function resetCake() {
    if (confirm("¿Estás seguro que deseas reiniciar el diseño del pastel?")) {
        // Eliminar modelos de flores
        Object.values(flowerModels).forEach(model => scene.remove(model));
        flowerModels = {};
        
        // Restablecer valores
        selectedModel = '1_piso.fbx';
        selectedFlavor = null;
        selectedFillings = [];
        selectedDecorations = [];
        
        // Cargar modelo inicial
        loadCakeModel(selectedModel);
        showCapas();
        updateSelectionsInfo();
    }
}

// Animación
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Navegación
function goBack() {
    window.history.back();
}

// Inicializar al cargar la página
window.onload = init;

// Ajustar tamaño al cambiar la ventana
window.addEventListener('resize', () => {
    camera.aspect = (window.innerWidth * 0.7) / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * 0.7, window.innerHeight);
});