window.addEventListener('load', (event) => {
    console.log('Page is fully loaded');

    document.getElementById('submitButton').addEventListener('click', function (event) {
        // Prevent the default link behavior
        event.preventDefault();
        
        // Hide the button section
        document.getElementById('button').style.display = 'none';
        document.getElementById('instructions').style.display = 'none';
        // Show the p5js canvas section
        document.getElementById('verbs').style.display = 'block';
        document.getElementById('canvas-container').style.display = 'block';
    });
});

// Function to update the verbs font based on click count
function updateVerbsFont(clickCount) {
    const verbsElement = document.getElementById('skin-can');
    if (!verbsElement) return;
    
    let fontFamily;
    
    // Progressive clarification based on click count (starts redacted, becomes clearer)
    if (clickCount <= 8) {
        fontFamily = "'Redaction-100', Arial, sans-serif";
    } else if (clickCount <= 16) {
        fontFamily = "'Redaction-70', Arial, sans-serif";
    } else if (clickCount <= 24) {
        fontFamily = "'Redaction-50', Arial, sans-serif";
    } else if (clickCount <= 32) {
        fontFamily = "'Redaction-35', Arial, sans-serif";
    } else if (clickCount <= 40) {
        fontFamily = "'Redaction-20', Arial, sans-serif";
    } else if (clickCount <= 48) {
        fontFamily = "'Redaction-10', Arial, sans-serif";
    } else {
        fontFamily = "'Redaction', Arial, sans-serif";
    }
    
    verbsElement.style.fontFamily = fontFamily;
    console.log(`Updated verbs font to: ${fontFamily} (clicks: ${clickCount})`);
}