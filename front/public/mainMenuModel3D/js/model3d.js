let scene, camera, renderer, controls, loader, cakeModel;
let selectedModel = '1_piso.fbx';
let selectedFlavor = null;
let selectedFillings = [];
let selectedDecorations = [];
const userId = localStorage.getItem('id_usuario');
const reposteroId = 1;

let flowerModels = {}; // Para almacenar los modelos de flores por piso

// Agregar lista de sabores disponibles
const SABORES_BIZCOCHO = [
    'Vainilla',
    'Chocolate',
    'Red Velvet',
    'Zanahoria',
    'Mármol',
    'Limón',
    'Naranja',
    'Almendra'
];

// Agregar lista de rellenos disponibles
const RELLENOS_DISPONIBLES = [
    'Crema de Vainilla',
    'Ganache de Chocolate',
    'Dulce de Leche',
    'Crema de Fresa',
    'Mermelada de Frambuesa',
    'Crema de Limón',
    'Nutella',
    'Crema de Café'
];

// Agregar lista de decoraciones disponibles
const DECORACIONES_DISPONIBLES = [
    'Flores de Azúcar',
    'Flores Naturales',
    'Flores de Fondant'
];

// Definir colores para cada sabor
const SABORES_COLORES = {
    'Vainilla': 0xf7dc6f,      // Color crema claro
    'Chocolate': 0x3C1321,     // Marrón chocolate
    'Red Velvet': 0x960018,    // Rojo intenso
    'Zanahoria': 0xba4a00,     // Naranja suave
    'Mármol': {                // Para el mármol usaremos dos colores
        primary: 0xf7dc6f,     // Vainilla
        secondary: 0xd98880   // Chocolate
    },
    'Limón': 0x196f3d,         // Amarillo limón
    'Naranja': 0x873600,       // Naranja
    'Almendra': 0x78281f       // Color almendra
};

function init() {
    scene = new THREE.Scene();
    
    // Ajustar el campo de visión y la posición de la cámara
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 150, 300); // Ajustar posición inicial de la cámara
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('cakeCanvas'), alpha: true });
    renderer.setSize(window.innerWidth * 0.6, window.innerHeight);
    document.querySelector('.cake-container').appendChild(renderer.domElement);

    // Configurar los controles
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    
    // Ajustar límites de zoom
    controls.minDistance = 200;  // Distancia mínima para zoom in
    controls.maxDistance = 500;  // Distancia máxima para zoom out
    
    // Ajustar límites de rotación vertical
    controls.minPolarAngle = 0;  // Permite ver desde arriba
    controls.maxPolarAngle = Math.PI/2;  // Limita la vista desde abajo
    
    controls.target.set(0, 50, 0); // Punto al que mira la cámara
    controls.rotateSpeed = 0.5;

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    loader = new THREE.FBXLoader();
    loadCakeModel(selectedModel);
    animate();

    // Crear el div para mostrar las selecciones en la parte superior
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
    `;
    cakeContainer.appendChild(selectionsInfo);
    updateSelectionsInfo(); // Función nueva para actualizar la información
}

function loadCakeModel(modelPath) {
    selectedModel = modelPath;
    if (cakeModel) {
        scene.remove(cakeModel);
        cakeModel = null;
    }

    loader.load(`models/${modelPath}`, function (object) {
        cakeModel = object;
        cakeModel.scale.set(0.5, 0.5, 0.5);
        cakeModel.position.set(0, 0, 0); // Centrar el modelo en el origen

        // Si hay un sabor seleccionado, aplicar el color correspondiente
        if (selectedFlavor) {
            const color = SABORES_COLORES[selectedFlavor];
            if (selectedFlavor === 'Mármol') {
                applyMarbleTexture();
            } else {
                applySolidColor(color);
            }
        } else {
            // Color por defecto si no hay sabor seleccionado
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
        
        // Ajustar la cámara al tamaño del modelo
        const box = new THREE.Box3().setFromObject(cakeModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Actualizar el target de los controles al centro del modelo
        controls.target.copy(center);
        controls.update();

        updateSelectionsInfo(); // Actualizar información
    });
}

function updateSelectionsInfo() {
    const selectionsInfo = document.getElementById('selectionsInfo');
    if (selectionsInfo) {
        selectionsInfo.innerHTML = `
            <h4 style="color: #731D3C; margin: 0 0 10px 0;">Capas: ${selectedModel.replace('.fbx', '')}</h4>
            <h4 style="color: #731D3C; margin: 0 0 10px 0;">Bizcocho: ${selectedFlavor || 'Ninguno'}</h4>
            <h4 style="color: #731D3C; margin: 0 0 10px 0;">Relleno: ${selectedFillings.length ? selectedFillings.join(', ') : 'Ninguno'}</h4>
            <h4 style="color: #731D3C; margin: 0;">Decoraciones: ${selectedDecorations.length ? selectedDecorations.join(', ') : 'Ninguna'}</h4>
        `;
    }
}

function saveCake() {
    if (!userId) {
        alert("Debes iniciar sesión para guardar tu pastel.");
        return;
    }
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

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.onload = init;

// Funciones del HTML
function goBack() {
    window.history.back();
}

function showCapas() {
    document.getElementById('sidebarTitle').textContent = 'Opciones de Capas';
    
    const capasOptions = document.getElementById('capasOptions');
    capasOptions.style.display = 'block';
    
    capasOptions.innerHTML = `
        
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <button style="width: 100%; text-align: center; background: #731D3C; color: white; padding: 10px; border: none; border-radius: 4px;" 
                    onclick="loadCakeModel('1_piso.fbx')">
                1 Piso
            </button>
            <button style="width: 100%; text-align: center; background: #731D3C; color: white; padding: 10px; border: none; border-radius: 4px;" 
                    onclick="loadCakeModel('2_pisos.fbx')">
                2 Pisos
            </button>
            <button style="width: 100%; text-align: center; background: #731D3C; color: white; padding: 10px; border: none; border-radius: 4px;" 
                    onclick="loadCakeModel('3_pisos.fbx')">
                3 Pisos
            </button>
            <button style="width: 100%; text-align: center; background: #731D3C; color: white; padding: 10px; border: none; border-radius: 4px;" 
                    onclick="loadCakeModel('4_pisos.fbx')">
                4 Pisos
            </button>
        </div>
    `;
    
    // Ocultar las otras secciones
    document.getElementById('bizcochoList').style.display = 'none';
    document.getElementById('rellenoList').style.display = 'none';
    document.getElementById('decoracionesList').style.display = 'none';
}

function showBizcocho() {
    document.getElementById('sidebarTitle').textContent = 'Bizcocho';
    document.getElementById('capasOptions').style.display = 'none';
    
    const bizcochoList = document.getElementById('bizcochoList');
    bizcochoList.style.display = 'block';
    
    // Modificar la estructura para que los botones se alineen a la izquierda
    bizcochoList.innerHTML = `
        <div class="controls" style="flex-direction: column; align-items: flex-start;">
            ${SABORES_BIZCOCHO.map(sabor => `
                <button style="width: 100%; margin: 5px 0; text-align: left; padding-left: 20px;" 
                        onclick="selectFlavor('${sabor}')">
                    ${sabor}
                </button>
            `).join('')}
        </div>
    `;
    
    document.getElementById('rellenoList').style.display = 'none';
    document.getElementById('decoracionesList').style.display = 'none';
}

function selectFlavor(flavor) {
    selectedFlavor = flavor;
    updateSelectionsInfo(); // Actualizar información
    
    // Actualizar los botones activos
    const buttons = document.querySelectorAll('#bizcochoList button');
    buttons.forEach(button => {
        if (button.textContent.trim() === flavor) {
            button.style.background = '#A65168';
        } else {
            button.style.background = '#731D3C';
        }
    });

    // Aplicar color al modelo 3D
    if (cakeModel) {
        const color = SABORES_COLORES[flavor];
        
        if (flavor === 'Mármol') {
            // Tratamiento especial para el mármol
            applyMarbleTexture();
        } else {
            // Aplicar color sólido para otros sabores
            applySolidColor(color);
        }
    }
}

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

function applyMarbleTexture() {
    // Crear un material para el efecto mármol
    const marbleColors = SABORES_COLORES['Mármol'];
    
    // Crear una textura procedural para el mármol
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Generar patrón de mármol
    ctx.fillStyle = `#${marbleColors.primary.toString(16)}`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Agregar vetas
    ctx.fillStyle = `#${marbleColors.secondary.toString(16)}`;
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
            x + 50, y - 50,
            x + 100, y + 50,
            x + 150, y
        );
        ctx.lineWidth = 5 + Math.random() * 10;
        ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
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

function showRelleno() {
    document.getElementById('sidebarTitle').textContent = 'Relleno';
    document.getElementById('capasOptions').style.display = 'none';
    document.getElementById('bizcochoList').style.display = 'none';
    
    const rellenoList = document.getElementById('rellenoList');
    rellenoList.style.display = 'block';
    
    // Aplicar el mismo estilo a los botones de relleno
    rellenoList.innerHTML = `
        <div class="controls" style="flex-direction: column; align-items: flex-start;">
            ${RELLENOS_DISPONIBLES.map(relleno => `
                <button style="width: 100%; margin: 5px 0; text-align: left; padding-left: 20px;"
                        onclick="selectFilling('${relleno}')">
                    ${relleno}
                </button>
            `).join('')}
        </div>
    `;
    
    document.getElementById('decoracionesList').style.display = 'none';
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
    
    updateSelectionsInfo(); // Actualizar información
    // Actualizar los botones activos
    const buttons = document.querySelectorAll('#rellenoList button');
    buttons.forEach(button => {
        if (selectedFillings.includes(button.textContent.trim())) {
            button.style.background = '#A65168';
        } else {
            button.style.background = '#731D3C';
        }
    });
}

function showDecoraciones() {
    document.getElementById('sidebarTitle').textContent = 'Decoraciones';
    document.getElementById('capasOptions').style.display = 'none';
    document.getElementById('bizcochoList').style.display = 'none';
    document.getElementById('rellenoList').style.display = 'none';
    
    const decoracionesList = document.getElementById('decoracionesList');
    decoracionesList.style.display = 'block';
    
    // Aplicar el mismo estilo a los botones de decoraciones
    decoracionesList.innerHTML = `
        <div class="controls" style="flex-direction: column; align-items: flex-start;">
            ${DECORACIONES_DISPONIBLES.map(decoracion => `
                <button style="width: 100%; margin: 5px 0; text-align: left; padding-left: 20px;"
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
            // Para un piso, cargar directamente el modelo de flores
            loadFlowerModel('flores_1pisos.fbx', 1);
        } else {
            // Para múltiples pisos, mostrar diálogo de selección
            showFloorSelectionDialog(numPisos);
        }
    }
    
    if (selectedDecorations.includes(decoration)) {
        selectedDecorations = selectedDecorations.filter(d => d !== decoration);
    } else {
        selectedDecorations.push(decoration);
    }
    
    updateSelectionsInfo();
    
    const buttons = document.querySelectorAll('#decoracionesList button');
    buttons.forEach(button => {
        if (selectedDecorations.includes(button.textContent.trim())) {
            button.style.background = '#A65168';
        } else {
            button.style.background = '#731D3C';
        }
    });
}

function showFloorSelectionDialog(numPisos) {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
    `;
    
    dialog.innerHTML = `
        <h3 style="color: #731D3C; margin-bottom: 15px;">Selecciona el piso para las flores</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
            ${Array.from({length: numPisos}, (_, i) => i + 1).map(piso => `
                <button style="background: #731D3C; color: white; padding: 10px; border: none; border-radius: 4px;"
                        onclick="loadFlowerModel('flores_${numPisos}pisos.fbx', ${piso})">
                    Piso ${piso}
                </button>
            `).join('')}
            <button style="background: #A65168; color: white; padding: 10px; border: none; border-radius: 4px;"
                    onclick="this.parentElement.parentElement.remove()">
                Cancelar
            </button>
        </div>
    `;
    
    document.body.appendChild(dialog);
}

function loadFlowerModel(modelPath, floorNumber) {
    // Eliminar el diálogo si existe
    const dialog = document.querySelector('div[style*="position: fixed"]');
    if (dialog) dialog.remove();
    
    // Eliminar flores existentes en ese piso si las hay
    if (flowerModels[floorNumber]) {
        scene.remove(flowerModels[floorNumber]);
        delete flowerModels[floorNumber];
    }
    
    loader.load(`models/${modelPath}`, function (object) {
        const flowerModel = object;
        
        // Obtener el número total de pisos del pastel actual
        const numPisos = parseInt(selectedModel.charAt(0));
        
        // Ajustar escala según el número de pisos
        const baseScale = 0.5;
        const scaleMultiplier = 1 - ((numPisos - 1) * 0.15); // Ajuste más pronunciado para pasteles más altos
        flowerModel.scale.set(
            baseScale * scaleMultiplier,
            baseScale * scaleMultiplier,
            baseScale * scaleMultiplier
        );
        
        // Ajustar la posición según el piso
        const pisoHeight = 30; // Altura base ajustada para cada piso
        const radioBase = 20; // Radio base del pastel
        const reduccionRadio = 0.14; // Reducción del radio por piso
        
        // Calcular el radio para el piso actual
        const radioActual = radioBase * (1 - ((numPisos - floorNumber) * reduccionRadio));
        
        // Calcular la posición Y ajustada
        const yPosition = (floorNumber - 1) * pisoHeight;
        
        // Posicionar el modelo de flores pegado al lateral del pastel
        flowerModel.position.set(0, yPosition, radioActual);
        
        // Hacer que las flores sigan la rotación del pastel
        if (cakeModel) {
            // Crear un grupo para mantener las flores alrededor del pastel
            const flowerGroup = new THREE.Group();
            flowerGroup.add(flowerModel);
            
            // Actualizar la rotación cuando el pastel gira
            const updateFlowerPosition = () => {
                if (flowerGroup && cakeModel) {
                    flowerGroup.rotation.y = cakeModel.rotation.y;
                }
            };
            
            // Agregar listener para actualizar la rotación
            controls.addEventListener('change', updateFlowerPosition);
            
            scene.add(flowerGroup);
            flowerModels[floorNumber] = flowerGroup;
        } else {
            scene.add(flowerModel);
            flowerModels[floorNumber] = flowerModel;
        }
    });
}

function resetCake() {
    if (confirm("¿Estás seguro que deseas reiniciar el diseño del pastel?")) {
        // Eliminar todos los modelos de flores existentes
        Object.values(flowerModels).forEach(model => {
            scene.remove(model);
        });
        flowerModels = {};  // Reiniciar el objeto de modelos de flores
        
        selectedModel = '1_piso.fbx';
        selectedFlavor = null;
        selectedFillings = [];
        selectedDecorations = [];
        
        loadCakeModel(selectedModel);
        showCapas();
        updateSelectionsInfo();
        
        alert("El diseño del pastel ha sido reiniciado.");
    }
}
