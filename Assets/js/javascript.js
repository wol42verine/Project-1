$(document).foundation();

$(document).ready(function() {
    const apiUrl = 'https://perenual.com/api/species-list?key=sk-4WzR665567151aa035680&page=1';

    // Event listener for modal button
    $('button[data-open="plant-modal"]').on('click', function() {
        fetchPlantData();
    });

    // Event listener for plant selection
    $('#plant-select').on('change', function() {
        const plantId = $(this).val();
        if (plantId) {
            fetchPlantDetails(plantId);
        }
    });

    // Event listener for dismiss button using event delegation
    $(document).on('click', '.dismiss-button', function() {
        const plantId = $(this).closest('.plant-info').data('plant-id');
        removePlantData(plantId);
        $(this).closest('.plant-info').remove();
    });

    // Load plant data from localStorage when the page is loaded
    loadSavedPlantData();
});

function fetchPlantData() {
    const apiUrl = 'https://perenual.com/api/species-list?key=sk-4WzR665567151aa035680&page=1';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const plants = data.data;
            populatePlantSelect(plants);
        })
        .catch(error => console.error('Error fetching plant data:', error));
}

function populatePlantSelect(plants) {
    const select = $('#plant-select');
    select.empty(); // Clear existing options
    select.append('<option value="">Select a plant</option>');
    plants.forEach(plant => {
        select.append(`<option value="${plant.id}">${plant.common_name}</option>`);
    });
}

function fetchPlantDetails(plantId) {
    const apiUrl = `https://perenual.com/api/species/details/${plantId}?key=sk-4WzR665567151aa035680`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.id) {
                displayPlantInfo(data);
                savePlantData(data);
            } else {
                console.error('Unexpected plant details data structure:', data);
            }
        })
        .catch(error => console.error('Error fetching plant details:', error));
}

function savePlantData(plant) {
    let savedPlantData = JSON.parse(localStorage.getItem('plantData')) || [];
    savedPlantData.push(plant);
    localStorage.setItem('plantData', JSON.stringify(savedPlantData));
}

function removePlantData(plantId) {
    let savedPlantData = JSON.parse(localStorage.getItem('plantData')) || [];
    const updatedPlantData = savedPlantData.filter(plant => plant.id !== plantId);
    localStorage.setItem('plantData', JSON.stringify(updatedPlantData));
}

function loadSavedPlantData() {
    const savedPlantData = JSON.parse(localStorage.getItem('plantData'));
    if (savedPlantData && savedPlantData.length > 0) {
        savedPlantData.forEach(plant => {
            displayPlantInfo(plant);
        });
    }
}

function displayPlantInfo(plant) {
    const infoDiv = $('#left');
    const plantInfo = `
        <div class="plant-info" data-plant-id="${plant.id}">
            <h3>${plant.common_name || 'N/A'}</h3>
            <p><strong>Scientific Name:</strong> ${plant.scientific_name ? plant.scientific_name.join(', ') : 'N/A'}</p>
            <p><strong>Other Names:</strong> ${plant.other_name ? plant.other_name.join(', ') : 'N/A'}</p>
            <p><strong>Cycle:</strong> ${plant.cycle || 'N/A'}</p>
            <p><strong>Sunlight:</strong> ${plant.sunlight ? plant.sunlight.join(', ') : 'N/A'}</p>
            <p><strong>Watering:</strong> ${plant.watering || 'N/A'}</p>
            <img src="${plant.default_image ? plant.default_image.original_url : ''}" alt="${plant.common_name || 'N/A'}">
            <button class="dismiss-button">Dismiss</button>
        </div>
    `;
    infoDiv.append(plantInfo);
}

// Weather section
const inputCity = document.querySelector('#cname');
const submitBtn = document.querySelector('#cnsubmit');
const APIKey = "6d91ac03912ea4111a6d0d3486084c05";

submitBtn.addEventListener('click', function() {
    const city = inputCity.value;
    const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    fetch(queryURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        });
});
