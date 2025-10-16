/* -------------------------------------------------------------------------- */
/* UNIVERSAL VARIABLES AND PRELOAD OF IMAGES                 */
/* -------------------------------------------------------------------------- */

let images = [];
let scrollX = 0;
let imageWidth;
let imageHeight;
let totalWidth;
let isDragging = false;
let lastMouseX = 0;

// Layer system
let layerBuffers = [];
let backgroundBuffer; // Separate buffer for background
let numLayers = 10; // 4 Character layers + 6 Personarium layers
let imagesPerLayer = 6;

// Click-to-reveal settings
let revealRadius = 50; // Size of each revealed circle
// Stores {x: bufferX, y: bufferY, revealLevel: 1-6}
// revealLevel 1 means Layer 0 is erased, revealing Layer 1
let clickedSpots = [];
const proximityThreshold = 40; // Pixels distance to count as clicking an existing spot

// Mouse interaction timing
let mouseDownTime = 0;
let longClickThreshold = 500; // milliseconds for long click

// Image aspect ratio (640:179 or approximately 3.575:1)
const imgRatio = 640 / 179;

// Track if buffers are ready
let buffersReady = false;

/* ---------------------- Preload the set of 36 images ---------------------- */

function preload() {

    /* ------- CHARACTERS (0-23) - 24 images total, grouped by last digit ------- */

    // GROUP 1: All "-1" images (0-5)
    images[0] = loadImage('Characters/1-1.png');
    images[1] = loadImage('Characters/2-1.png');
    images[2] = loadImage('Characters/3-1.png');
    images[3] = loadImage('Characters/4-1.png');
    images[4] = loadImage('Characters/5-1.png');
    images[5] = loadImage('Characters/6-1.png');

    // GROUP 2: All "-2" images (6-11)
    images[6] = loadImage('Characters/1-2.png');
    images[7] = loadImage('Characters/2-2.png');
    images[8] = loadImage('Characters/3-2.png');
    images[9] = loadImage('Characters/4-2.png');
    images[10] = loadImage('Characters/5-2.png');
    images[11] = loadImage('Characters/6-2.png');

    // GROUP 3: All "-3" images (12-17)
    images[12] = loadImage('Characters/1-3.png');
    images[13] = loadImage('Characters/2-3.png');
    images[14] = loadImage('Characters/3-3.png');
    images[15] = loadImage('Characters/4-3.png');
    images[16] = loadImage('Characters/5-3.png');
    images[17] = loadImage('Characters/6-3.png');

    // GROUP 4: All "-4" images (18-23)
    images[18] = loadImage('Characters/1-4.png');
    images[19] = loadImage('Characters/2-4.png');
    images[20] = loadImage('Characters/3-4.png');
    images[21] = loadImage('Characters/4-4.png');
    images[22] = loadImage('Characters/5-4.png');
    images[23] = loadImage('Characters/6-4.png');

    /* ---------------------------- GRAY CLAY FIGURES --------------------------- */

    // PERSONARIUM LAYERS (24-59) - 6 LAYERS OF 6 IMAGES EACH (36 TOTAL)
    // LAYER 0 (TOP) - PERSONARIUM
    images[24] = loadImage('Personarium_Finales/F_Personarium-1.png');
    images[25] = loadImage('Personarium_Finales/F_Personarium-2.png');
    images[26] = loadImage('Personarium_Finales/F_Personarium-3.png');
    images[27] = loadImage('Personarium_Finales/F_Personarium-4.png');
    images[28] = loadImage('Personarium_Finales/F_Personarium-5.png');
    images[29] = loadImage('Personarium_Finales/F_Personarium-6.png');

    // LAYER 1 - FLAT
    images[30] = loadImage('Personarium_Finales/F2_FLAT_Personarium-1.png');
    images[31] = loadImage('Personarium_Finales/F2_FLAT_Personarium-2.png');
    images[32] = loadImage('Personarium_Finales/F2_FLAT_Personarium-3.png');
    images[33] = loadImage('Personarium_Finales/F2_FLAT_Personarium-4.png');
    images[34] = loadImage('Personarium_Finales/F2_FLAT_Personarium-5.png');
    images[35] = loadImage('Personarium_Finales/F2_FLAT_Personarium-6.png');

    // LAYER 2 - DECIMATE 1
    images[36] = loadImage('Personarium_Finales/F3_DECIMATE_FLAT_Personarium-1.png');
    images[37] = loadImage('Personarium_Finales/F3_DECIMATE_FLAT_Personarium-2.png');
    images[38] = loadImage('Personarium_Finales/F3_DECIMATE_FLAT_Personarium-3.png');
    images[39] = loadImage('Personarium_Finales/F3_DECIMATE_FLAT_Personarium-4.png');
    images[40] = loadImage('Personarium_Finales/F3_DECIMATE_FLAT_Personarium-5.png');
    images[41] = loadImage('Personarium_Finales/F3_DECIMATE_FLAT_Personarium-6.png');

    // LAYER 3 - DECIMATE 2
    images[42] = loadImage('Personarium_Finales/F4_DECIMATE2_FLAT_Personarium-1.png');
    images[43] = loadImage('Personarium_Finales/F4_DECIMATE2_FLAT_Personarium-2.png');
    images[44] = loadImage('Personarium_Finales/F4_DECIMATE2_FLAT_Personarium-3.png');
    images[45] = loadImage('Personarium_Finales/F4_DECIMATE2_FLAT_Personarium-4.png');
    images[46] = loadImage('Personarium_Finales/F4_DECIMATE2_FLAT_Personarium-5.png');
    images[47] = loadImage('Personarium_Finales/F4_DECIMATE2_FLAT_Personarium-6.png');

    // LAYER 4 - WIRE
    images[48] = loadImage('Personarium_Finales/F5_DECIMATE_Wireframe_1.png');
    images[49] = loadImage('Personarium_Finales/F5_DECIMATE_Wireframe_2.png');
    images[50] = loadImage('Personarium_Finales/F5_DECIMATE_Wireframe_3.png');
    images[51] = loadImage('Personarium_Finales/F5_DECIMATE_Wireframe_4.png');
    images[52] = loadImage('Personarium_Finales/F5_DECIMATE_Wireframe_5.png');
    images[53] = loadImage('Personarium_Finales/F5_DECIMATE_Wireframe_6.png');

    // LAYER 5 (BOTTOM) - SOUL
    images[54] = loadImage('Personarium_Finales/F6_Ed_Wireframe_1.png');
    images[55] = loadImage('Personarium_Finales/F6_Ed_Wireframe_2.png');
    images[56] = loadImage('Personarium_Finales/F6_Ed_Wireframe_3.png');
    images[57] = loadImage('Personarium_Finales/F6_Ed_Wireframe_4.png');
    images[58] = loadImage('Personarium_Finales/F6_Ed_Wireframe_5.png');
    images[59] = loadImage('Personarium_Finales/F6_Ed_Wireframe_6.png');

    // BACKGROUND IMAGE (60) - will be repeated 6 times
    images[60] = loadImage('Personarium_Finales/Fondo Large.jpeg');
}

/* -------------------------------------------------------------------------- */
/* CANVAS SETUP                                */
/* -------------------------------------------------------------------------- */

function setup() {
    // Add margins for symmetry (20px margin on each side to match CSS)
    let margin = 40; // 20px on each side
    let availableWidth = windowWidth - margin;
    
    // Make canvas taller by using a smaller ratio divisor (making it less wide relative to height)
    let canvasHeight = availableWidth / (imgRatio * 0.7); // 0.7 makes it taller
    canvasHeight = max(canvasHeight, 400); // Increased minimum height
    
    // Ensure canvas width respects margins
    let canvasWidth = min(availableWidth, canvasHeight * imgRatio * 0.7);

    // Create canvas and attach it to the canvas-container div
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');

    // Calculate image dimensions maintaining aspect ratio
    calculateImgDim();
}

function initializeBuffers() {
    console.log('initializeBuffers called');
    console.log(`Buffer dimensions: ${totalWidth}x${imageHeight}`);
    console.log(`Individual image size: ${imageWidth}x${imageHeight}`);

    // Verify dimensions are valid
    if (!totalWidth || !imageHeight || totalWidth <= 0 || imageHeight <= 0) {
        console.error('Invalid dimensions for buffers');
        return;
    }

    // Preserve the state of existing holes if resizing happens
    const oldSpots = [...clickedSpots];
    clickedSpots = [];
    layerBuffers = [];

    try {
        // Create background buffer (repeated 6 times)
        backgroundBuffer = createGraphics(totalWidth, imageHeight);
        if (images[60]) { // Fondo image
            for (let i = 0; i < imagesPerLayer; i++) {
                let x = i * imageWidth;
                backgroundBuffer.image(images[60], x, 0, imageWidth, imageHeight);
            }
            console.log('Background buffer created');
        }

        // Create layer buffers (10 layers total: 4 character + 6 Personarium)
        for (let layer = 0; layer < numLayers; layer++) {
            let buffer = createGraphics(totalWidth, imageHeight);

            // Draw all 6 images for this layer onto the buffer
            for (let i = 0; i < imagesPerLayer; i++) {
                let imgIndex;
                let x = i * imageWidth;

                if (layer < 4) {
                    // Character layers (0-3): Use character groups 1-4
                    // Layer 0 = Group 1 (indices 0-5), Layer 1 = Group 2 (indices 6-11), etc.
                    imgIndex = layer * imagesPerLayer + i;
                } else {
                    // Personarium layers (4-9): Use Personarium images (indices 24-59)
                    // Layer 4 = Personarium Layer 0 (indices 24-29), etc.
                    imgIndex = 24 + ((layer - 4) * imagesPerLayer) + i;
                }

                if (images[imgIndex]) {
                    buffer.image(images[imgIndex], x, 0, imageWidth, imageHeight);
                } else {
                    console.warn(`Image ${imgIndex} is missing for layer ${layer}`);
                }
            }

            layerBuffers.push(buffer);
        }

        buffersReady = true;
        console.log('✓ All buffers initialized successfully!');

        // Re-apply existing hole state after resizing
        if (oldSpots.length > 0) {
            applyHoleState(oldSpots);
        }

    } catch (error) {
        console.error('Error creating buffers:', error);
        buffersReady = false;
    }
}

// Function to redraw holes based on saved state (used during resizing)
function applyHoleState(spots) {
    for (const spot of spots) {
        // Only apply up to the current reveal level
        for (let i = 0; i < spot.revealLevel; i++) {
            eraseSpotOnLayer(i, spot.x, spot.y);
        }
    }
    // Restore the simplified state array
    clickedSpots = spots;
}

function draw() {
    background(255);

    // Initialize buffers only after images are loaded
    if (!buffersReady) {
        // --- Loading logic ---
        fill(0);
        textAlign(CENTER, CENTER);

        // Count how many images are actually ready
        let readyCount = 0;
        let totalImages = 61; // 24 characters + 36 Personarium + 1 background = 61 total
        for (let img of images) {
            if (img && img.width > 0) readyCount++;
        }

        text(`Loading... ${readyCount} of ${totalImages} images ready`, width / 2, height / 2);

        if (readyCount === totalImages) {
            initializeBuffers();
        }

        if (!buffersReady) return;
    }
    // --- End Loading logic ---

    // Constrain scrolling
    let minScroll = -(totalWidth - width);
    let maxScroll = 0;
    scrollX = constrain(scrollX, minScroll, maxScroll);

    // Draw layered composition
    drawLayeredImages();

    // Show instructions
    fill(0);
    textAlign(LEFT, TOP);
    textSize(15);
    textFont('Redaction-10');
    textStyle(ITALIC);
    text(`Click on a spot to drill down layers of skin or pierce through a mask or a persona • Drag to scroll • Holes you've punctured through: ${clickedSpots.length}`, 10, 10);
}

function drawLayeredImages() {
    // First draw the background (instead of white background)
    if (backgroundBuffer) {
        // Draw background buffer at actual calculated size
        image(backgroundBuffer, scrollX, 0, totalWidth, imageHeight);
    }

    // Then draw layers from bottom (Layer 9) to top (Layer 0)
    for (let layer = numLayers - 1; layer >= 0; layer--) {
        if (layerBuffers[layer]) {
            // Draw each layer buffer at actual calculated size
            image(layerBuffers[layer], scrollX, 0, totalWidth, imageHeight);
        }
    }
}


/* -------------------------------------------------------------------------- */
/* FUNCTIONS FOR INTERACTION AND RESIZING                   */
/* -------------------------------------------------------------------------- */

function mousePressed() {
    // Reset dragging flag, assuming a click until proven otherwise by mouseDragged
    isDragging = false;
    lastMouseX = mouseX;
    mouseDownTime = millis();
}

function mouseDragged() {
    // If the mouse moves far enough, confirm it's a drag
    if (dist(mouseX, mouseY, lastMouseX, mouseY) > 5) {
        isDragging = true;
    }

    if (isDragging) {
        let deltaX = mouseX - lastMouseX;
        scrollX += deltaX;
        lastMouseX = mouseX;
    }
}

function mouseReleased() {
    let clickDuration = millis() - mouseDownTime;

    // If we didn't drag (or dragged very little) AND it's a short click, treat it as a reveal
    if (!isDragging && clickDuration < longClickThreshold) {
        handleClick(mouseX, mouseY);
    }

    isDragging = false;
}

// Helper to find the closest existing spot in buffer coordinates
function findClosestSpot(bufferX, bufferY) {
    let closestSpot = null;
    let minDistance = proximityThreshold;

    for (const spot of clickedSpots) {
        let d = dist(bufferX, bufferY, spot.x, spot.y);
        if (d < minDistance) {
            minDistance = d;
            closestSpot = spot;
        }
    }
    return closestSpot;
}

// New function to perform the actual erasure on a specific layer buffer
function eraseSpotOnLayer(layerIndex, x, y) {
    if (layerIndex >= 0 && layerIndex < numLayers) {
        const layer = layerBuffers[layerIndex];

        layer.erase();
        layer.noStroke();
        layer.fill(255);
        layer.ellipse(x, y, revealRadius * 2, revealRadius * 2);
        layer.noErase();

        console.log(`✓ Erased Layer ${layerIndex} at buffer (${x}, ${y})`);
    }
}

function handleClick(clickX, clickY) {
    if (!buffersReady) return;

    // Convert screen coordinates to buffer coordinates (relative to the long image)
    let bufferX = clickX - scrollX;
    let bufferY = clickY;

    // Check bounds
    if (bufferX < 0 || bufferX >= totalWidth || bufferY < 0 || bufferY >= imageHeight) {
        console.log('Click outside buffer bounds');
        return;
    }

    let shouldUpdateFont = false;

    // 1. Find the closest existing spot (hole)
    let targetSpot = findClosestSpot(bufferX, bufferY);

    if (targetSpot) {
        // 2. Spot exists: Try to deepen the hole
        if (targetSpot.revealLevel < numLayers - 1) {
            targetSpot.revealLevel++;
            // If revealLevel is 2, we need to erase layer 1 (index 1).
            // layerIndex = revealLevel - 1
            let layerToEraseIndex = targetSpot.revealLevel - 1;
            eraseSpotOnLayer(layerToEraseIndex, targetSpot.x, targetSpot.y);
            console.log(`Deepened hole to Level ${targetSpot.revealLevel}`);
            shouldUpdateFont = true;
        } else {
            console.log('Hole is already at maximum depth (Level 6)');
        }
    } else {
        // 3. New spot: Start a new hole (Level 1, erasing layer 0)
        let newSpot = { x: bufferX, y: bufferY, revealLevel: 1 };
        clickedSpots.push(newSpot);

        // Erase the top layer (index 0)
        eraseSpotOnLayer(0, bufferX, bufferY);
        console.log('Created new hole at Level 1');
        shouldUpdateFont = true;
    }

    // Update the verbs font based on total interaction count
    if (shouldUpdateFont && typeof updateVerbsFont === 'function') {
        // Calculate total interactions (new spots + deepening clicks)
        let totalInteractions = clickedSpots.reduce((total, spot) => total + spot.revealLevel, 0);
        updateVerbsFont(totalInteractions);
    }
}


function windowResized() {
    // Add margins for symmetry (20px margin on each side to match CSS)
    let margin = 40; // 20px on each side
    let availableWidth = windowWidth - margin;
    
    // Make canvas taller by using a smaller ratio divisor
    let canvasHeight = availableWidth / (imgRatio * 0.7); // 0.7 makes it taller
    canvasHeight = max(canvasHeight, 400); // Increased minimum height
    
    // Ensure canvas width respects margins
    let canvasWidth = min(availableWidth, canvasHeight * imgRatio * 0.7);

    resizeCanvas(canvasWidth, canvasHeight);
    calculateImgDim();

    // Reinitialize buffers with new dimensions and re-apply hole state
    buffersReady = false;
    // We check if images are loaded before attempting re-initialization
    if (images.every(img => img && img.width > 0)) {
        initializeBuffers();
    }
}

function calculateImgDim() {
    // Force images to use the full canvas height while maintaining aspect ratio
    imageHeight = height;
    imageWidth = height * imgRatio;

    // Debug: Log the calculated dimensions
    console.log(`Canvas: ${width}x${height}`);
    console.log(`Calculated image: ${imageWidth}x${imageHeight}`);
    console.log(`Image ratio: ${imgRatio}`);

    // Total width for the 6-image panorama
    totalWidth = imageWidth * 6;
    
    console.log(`Total panorama width: ${totalWidth}`);
}
