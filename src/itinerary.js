// Initialize wardrobe from localStorage
let wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || [];

// Render items function to display itinerary items with updated details
function renderItems() {
    const itinerary = loadItinerary();
    const itineraryContainer = document.querySelector('.itinerary-list');
    itineraryContainer.innerHTML = '';  // Clear current items

    itinerary.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('itinerary-item');

        // Display outfits, peripherals, and color
        const description = document.createElement('span');
        description.innerText = `Outfits: ${item.description}`;

        const peripherals = document.createElement('span');
        peripherals.innerText = `Peripherals: ${item.item}`;

        const color = document.createElement('span');
        color.innerText = `Color: ${item.color || "Add a color"}`;  // Default to "Add a color" if empty

        // Edit button to modify the item
        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', () => editItineraryItem(item.id));

        // Delete button to remove the item
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => deleteItineraryItem(item.id));

        // Append all elements to the item container
        itemElement.appendChild(description);
        itemElement.appendChild(peripherals);
        itemElement.appendChild(color);
        itemElement.appendChild(editButton);
        itemElement.appendChild(deleteButton);
        itineraryContainer.appendChild(itemElement);
    });
}

// Load itinerary data from Electron
function loadItinerary() {
    return window.electronAPI.loadItinerary();
}

// Save itinerary data to Electron
function saveItinerary(itinerary) {
    window.electronAPI.saveItinerary(itinerary);
}

function editItineraryItem(id) {
    const itinerary = loadItinerary();
    const index = itinerary.findIndex(item => item.id === id);
    const item = itinerary[index];

    // Populate modal inputs with existing item data
    document.getElementById('edit-description').value = item.description || '';
    document.getElementById('edit-item').value = item.item || '';
    document.getElementById('edit-color').value = item.color || '';

    // Show the modal
    const modal = document.getElementById('edit-modal');
    modal.classList.add('show'); // Show the modal
    modal.classList.remove('hidden'); // Make sure it's not hidden

    // Focus the first input field
    document.getElementById('edit-description').focus();

    // Handle save
    document.getElementById('save-edit').onclick = () => {
        const newDescription = document.getElementById('edit-description').value;
        const newItem = document.getElementById('edit-item').value;
        const newColor = document.getElementById('edit-color').value;

        // Update and save the item
        itinerary[index] = { id, description: newDescription, item: newItem, color: newColor };
        saveItinerary(itinerary);
        renderItems();

        // Close the modal
        modal.classList.remove('show');
    };

    // Handle cancel
    document.getElementById('cancel-edit').onclick = () => {
        modal.classList.remove('show'); // Hide modal on cancel
    };

    // Prevent clicking outside the modal from closing it
    modal.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    };
}


// Delete itinerary item
function deleteItineraryItem(id) {
    let itinerary = loadItinerary();
    const index = itinerary.findIndex(item => item.id === id);
    if (index !== -1) {
        itinerary.splice(index, 1);
        saveItinerary(itinerary); // Use save function instead of localStorage directly
        renderItems();
    }
}

// Add new wardrobe item from inputs
function addWardrobeItem() {
    const description = document.getElementById('customItemName').value.trim();
    const item = document.getElementById('customItemType').value.trim();
    const color = document.getElementById('customItemColor').value.trim();

    if (description && item) { // Ensure both fields are filled
        const newItem = {
            id: Date.now(), // Unique ID based on timestamp
            description: description,
            item: item,
            color: color
        };

        // Save the new item in local storage
        let itinerary = loadItinerary();
        itinerary.push(newItem);
        saveItinerary(itinerary); // Save updated itinerary
        renderItems(); // Re-render items

        // Clear input fields
        document.getElementById('customItemName').value = '';
        document.getElementById('customItemType').value = '';
        document.getElementById('customItemColor').value = '';
    } else {
        alert("Please fill in all fields."); // Alert if input is missing
    }
}

// Clear all wardrobe items
function clearWardrobe() {
    if (confirm("Are you sure you want to clear all wardrobe items?")) {
        localStorage.removeItem('wardrobe'); // Clear local storage
        renderItems(); // Re-render items to reflect the cleared state
    }
}

// Initialize and render items on page load
document.addEventListener('DOMContentLoaded', () => {
    renderItems();

    // Bind the add item button to the add function
    document.getElementById('add-item-button').addEventListener('click', addWardrobeItem);
    
    // Bind the clear wardrobe button to the clear function
    document.getElementById('clear-wardrobe-button').addEventListener('click', clearWardrobe);
});

// Ensure the modal is hidden on page load
const modal = document.getElementById('edit-modal');
modal.classList.remove('hidden'); // Make sure this doesn't run initially
