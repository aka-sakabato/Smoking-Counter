let counter = parseInt(localStorage.getItem('counter')) || 0; // Retrieve counter from localStorage or set to 0
const timestamps = JSON.parse(localStorage.getItem('timestamps')) || []; // Retrieve timestamps or set to empty array
const counterValue = document.getElementById('counter-value');
const incrementBtn = document.getElementById('increment-btn');
const generatePdfBtn = document.getElementById('generate-pdf');
const resetBtn = document.getElementById('reset-btn');

// Update the displayed counter value on page load
counterValue.innerHTML = counter;

incrementBtn.addEventListener('click', () => {
    counter++;
    timestamps.push(new Date());
    localStorage.setItem('counter', counter); // Save updated counter to localStorage
    localStorage.setItem('timestamps', JSON.stringify(timestamps)); // Save updated timestamps to localStorage
    counterValue.innerHTML = counter;
});

generatePdfBtn.addEventListener('click', () => {
    generatePDFForLast24Hours();
});

// Reset functionality
resetBtn.addEventListener('click', () => {
    localStorage.removeItem('counter'); // Remove counter from localStorage
    localStorage.removeItem('timestamps'); // Remove timestamps from localStorage
    counter = 0; // Reset counter variable
    timestamps.length = 0; // Clear timestamps array
    counterValue.innerHTML = counter; // Update displayed value
});

function generatePDFForLast24Hours() {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // Calculate timestamp for 24 hours ago

    const filteredTimestamps = timestamps.filter(timestamp => {
        const timestampDate = new Date(timestamp);
        return timestampDate >= twentyFourHoursAgo && timestampDate <= now;
    });

    const { jsPDF } = window.jspdf; // Access jsPDF from the global window object
    const doc = new jsPDF();
    doc.text("Smoking Count Report for Last 24 Hours", 10, 10);
    
    // Check if there are any filtered timestamps
    if (filteredTimestamps.length === 0) {
        doc.text("No data available for the last 24 hours.", 10, 20);
    } else {
        // Start writing timestamps from line 30
        let yPosition = 30;
        filteredTimestamps.forEach((timestamp, index) => {
            doc.text(`${index + 1}: ${new Date(timestamp).toLocaleString()}`, 10, yPosition);
            yPosition += 10; // Move down for the next line
        });
    }

    doc.save("smoking_report_last_24_hours.pdf");
}
