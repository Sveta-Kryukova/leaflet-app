let map;
let markers = {};

const MAX_DESCRIPTION_LENGTH = 200;
const customIcon = L.icon({
  iconUrl: 'images/marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

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
    <form id="editPlaceForm${id}" class="editPlaceForm">
      <label for="editName${id}">Name:</label>
      <input type="text" id="editName${id}" name="editName" value="${marker.name}" required><br>

      <label for="editDescription${id}">Description:</label>
      <textarea id="editDescription${id}" name="editDescription">${marker.description}</textarea>
      <div id="descriptionCounter${id}"></div><br>

      <button type="submit">Save</button>
      <button class="cancelEdit" data-id="${id}">Cancel</button>
    </form>
  `;
  marker.setPopupContent(popupContent);

  const editPlaceForm = document.getElementById(`editPlaceForm${id}`);
  const editNameInput = document.getElementById(`editName${id}`);
  const editDescriptionInput = document.getElementById(`editDescription${id}`);
  const descriptionCounter = document.getElementById(`descriptionCounter${id}`);

  editDescriptionInput.addEventListener('input', () => {
    const descriptionLength = editDescriptionInput.value.length;
    const remainingCharacters = MAX_DESCRIPTION_LENGTH - descriptionLength;
    descriptionCounter.textContent = `${remainingCharacters} characters left`;

    if (descriptionLength > MAX_DESCRIPTION_LENGTH) {
      descriptionCounter.style.color = 'red';
      editDescriptionInput.classList.add('error');
      descriptionCounter.textContent = `Text is more than 200 characters`;
    } else {
      descriptionCounter.style.color = '';
      editDescriptionInput.classList.remove('error');
    }
  });

  editPlaceForm.addEventListener('submit', (event) => {
    event.preventDefault();
    savePlace(id, editNameInput, editDescriptionInput);
  });
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

function savePlace(id, editNameInput, editDescriptionInput) {
  const marker = markers[id];
  const newName = editNameInput.value.trim();
  const newDescription = editDescriptionInput.value.trim();

  if (newName === '') {
    editNameInput.style.borderColor = 'red';
    showValidationErrorModal('Please enter a name for the place.');
    editNameInput.focus();
    return;
  }

  if (/^[0-9\W]+$/.test(newName)) {
    editNameInput.style.borderColor = 'red';
    showValidationErrorModal('Name should not consist of numbers or symbols.');
    editNameInput.focus();
    return;
  }

  editNameInput.style.borderColor = '';

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
  } else if (event.target.classList.contains('cancelEdit')) {
    cancelEditPlace(id);
  }
}

function showValidationErrorModal(message) {
  const modal = document.getElementById('validationErrorModal');
  const errorMessage = document.getElementById('validationErrorMessage');
  errorMessage.textContent = message;
  modal.style.display = 'block';
}

function hideValidationErrorModal() {
  const modal = document.getElementById('validationErrorModal');
  modal.style.display = 'none';
}

function initializeMap() {
  map = L.map('map').setView([50.4501, 30.5234], 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  map.on('click', (event) => {
    const { lat, lng } = event.latlng;
    const latitude = lat.toFixed(6);
    const longitude = lng.toFixed(6);

    document.getElementById('latitude').value = latitude;
    document.getElementById('longitude').value = longitude;
    document.getElementById('newPlaceForm').style.display = 'flex';
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
}

function initializeNewPlaceForm() {
  const form = document.getElementById('newPlaceForm');
  const closeFormBtn = document.getElementById('closeForm');
  const descriptionInput = document.getElementById('description');
  const descriptionCounter = document.getElementById('descriptionCounter');

  closeFormBtn.addEventListener('click', () => {
    form.style.display = 'none';
    form.reset();
  });

  descriptionInput.addEventListener('input', () => {
    const descriptionLength = descriptionInput.value.length;
    const remainingCharacters = MAX_DESCRIPTION_LENGTH - descriptionLength;
    descriptionCounter.textContent = `${remainingCharacters} characters left`;

    if (descriptionLength > MAX_DESCRIPTION_LENGTH) {
      descriptionCounter.style.color = 'red';
      descriptionInput.classList.add('error');
      descriptionCounter.textContent = `Text is more than 200 characters`;
    } else {
      descriptionCounter.style.color = '';
      descriptionInput.classList.remove('error');
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const descriptionInput = document.getElementById('description');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');

    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    const latitude = parseFloat(latitudeInput.value);
    const longitude = parseFloat(longitudeInput.value);

    if (name === '') {
      nameInput.style.borderColor = 'red';
      showValidationErrorModal('Please enter a name for the place.');
      nameInput.focus();
      return;
    }

    if (/^[0-9\W]+$/.test(name)) {
      nameInput.style.borderColor = 'red';
      showValidationErrorModal('Name should not consist of numbers or symbols.');
      nameInput.focus();
      return;
    }
    nameInput.style.borderColor = '';

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      descriptionInput.style.borderColor = 'red';
      showValidationErrorModal('Description length should not exceed 200 characters.');
      descriptionInput.focus();
      return;
    }

    descriptionInput.style.borderColor = '';

    if (isNaN(latitude) || !isFinite(latitude)) {
      latitudeInput.style.borderColor = 'red';
      showValidationErrorModal('Please enter a valid latitude.');
      latitudeInput.focus();
      return;
    }

    latitudeInput.style.borderColor = '';

    if (isNaN(longitude) || !isFinite(longitude)) {
      longitudeInput.style.borderColor = 'red';
      showValidationErrorModal('Please enter a valid longitude.');
      longitudeInput.focus();
      return;
    }

    longitudeInput.style.borderColor = '';

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
        form.style.display = 'none';
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

function initializeValidationErrorModal() {
  const modal = document.getElementById('validationErrorModal');
  const closeModalButton = document.querySelector('#validationErrorModal .close')

  closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

function initializeApp() {
  initializeMap();
  initializeNewPlaceForm();
  initializeValidationErrorModal();
}

initializeApp();
