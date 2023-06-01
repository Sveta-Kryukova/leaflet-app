let map;
let markers = {};

function deletePlace(id) {
  fetch(`http://localhost:3000/places/${id}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        if (markers.hasOwnProperty(id)) {
          map.removeLayer(markers[id]);
          delete markers[id];
        }
      } else {
        throw new Error('Failed to delete place');
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function editPlace(id) {
  const marker = markers[id];
  const popupContent = `
    <form id="editPlaceForm-${id}" class="edit-place-form">
      <label for="editName-${id}">Name:</label>
      <input type="text" id="editName-${id}" name="editName" value="${marker.name}" required><br>

      <label for="editDescription-${id}">Description:</label>
      <textarea id="editDescription-${id}" name="editDescription" required>${marker.description}</textarea><br>

      <button type="submit">Save</button>
      <button class="cancel-edit" data-id="${id}">Cancel</button>
    </form>
  `;
  marker.setPopupContent(popupContent);
}

function cancelEditPlace(id) {
  const marker = markers[id];
  const popupContent = `
    <b>${marker.name}</b><br>
    ${marker.description}<br>
    <button class="edit" data-id="${id}">Edit</button>
    <button class="delete" data-id="${id}">Delete</button>
  `;
  marker.setPopupContent(popupContent);
}

function savePlace(id) {
  const marker = markers[id];
  const newName = document.getElementById(`editName-${id}`).value;
  const newDescription = document.getElementById(`editDescription-${id}`).value;

  marker.name = newName;
  marker.description = newDescription;

  const popupContent = `
    <b>${newName}</b><br>
    ${newDescription}<br>
    <button class="edit" data-id="${id}">Edit</button>
    <button class="delete" data-id="${id}">Delete</button>
  `;
  marker.setPopupContent(popupContent);
}

function handleEditDeleteClick(event) {
  const id = event.target.dataset.id;
  if (event.target.classList.contains('edit')) {
    editPlace(id);
  } else if (event.target.classList.contains('delete')) {
    deletePlace(id);
  } else if (event.target.classList.contains('cancel-edit')) {
    cancelEditPlace(id);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  map = L.map('map').setView([50.4501, 30.5234], 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  const customIcon = L.icon({
    iconUrl: 'images/marker.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  map.on('click', (event) => {
    const { lat, lng } = event.latlng;
    const latitude = lat.toFixed(6);
    const longitude = lng.toFixed(6);

    document.getElementById('latitude').value = latitude;
    document.getElementById('longitude').value = longitude;
    document.getElementById('newPlaceForm').classList.remove('hidden');
  });

  fetch('http://localhost:3000/places')
    .then((response) => response.json())
    .then((places) => {
      places.forEach((place) => {
        const marker = L.marker([place.latitude, place.longitude], { icon: customIcon });
        marker.name = place.name;
        marker.description = place.description;
        marker.addTo(map);
        const popupContent = `
          <b>${place.name}</b><br>
          ${place.description}<br>
          <button class="edit" data-id="${place.id}">Edit</button>
          <button class="delete" data-id="${place.id}">Delete</button>
        `;
        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          document.addEventListener('click', handleEditDeleteClick);
        });
        marker.on('popupclose', () => {
          document.removeEventListener('click', handleEditDeleteClick);
        });
        markers[place.id] = marker;
      });
    })
    .catch((error) => console.error(error));

  const form = document.getElementById('newPlaceForm');
  map.on('click', () => {
    form.classList.remove('hidden');
  });

  const closeFormBtn = document.getElementById('closeForm');
  closeFormBtn.addEventListener('click', () => {
    form.classList.add('hidden');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);

    const newPlace = {
      name: name,
      description: description,
      latitude: latitude,
      longitude: longitude,
    };

    fetch('http://localhost:3000/places', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPlace),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to add place');
        }
      })
      .then((result) => {
        const marker = L.marker([latitude, longitude], { icon: customIcon });
        marker.name = name;
        marker.description = description;
        marker.addTo(map);
        const popupContent = `
          <b>${name}</b><br>
          ${description}<br>
          <button class="edit" data-id="${result.id}">Edit</button>
          <button class="delete" data-id="${result.id}">Delete</button>
        `;
        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          document.addEventListener('click', handleEditDeleteClick);
        });
        marker.on('popupclose', () => {
          document.removeEventListener('click', handleEditDeleteClick);
        });
        markers[result.id] = marker;

        form.reset();
        form.classList.add('hidden');
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

const instructionsModal = document.getElementById('instructionsModal');
      const closeModalButton = document.getElementById('closeModal');
      const modalShownKey = 'mapInstructionsShown';

      closeModalButton.addEventListener('click', () => {
        instructionsModal.style.display = 'none';
        localStorage.setItem(modalShownKey, 'true');
      });

      window.addEventListener('load', () => {
        const modalShown = localStorage.getItem(modalShownKey);

        if (!modalShown) {
          instructionsModal.style.display = 'block';
        }
      });