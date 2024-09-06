const applicantForm = document.getElementById('form');
const openButton = document.querySelector('[data-popup]');
const closeButton = document.querySelector('[data-close]');
const popup = document.querySelector('.popup');

function serializeForm(formNode) {
  const formData = new FormData(formNode);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  return data; 
}

async function sendDataToPipedrive(data) {
  const apiKey = "ef2896f75dda62f084c508cde1bd4128dc83a805";
  const pipedriveUrl = `https://vashey.pipedrive.com/v1/leads?api_token=ef2896f75dda62f084c508cde1bd4128dc83a805`;

  try {
    const response = await fetch(pipedriveUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      return result;
    } else {
      throw new Error(result.error || 'Failed to send data to Pipedrive');
    }
  } catch (error) {
    console.error('Error while sending data to Pipedrive:', error);
    throw error;
  }
}

function onSuccess(formNode) {
  alert('Form successfully sent');
  formNode.reset();
}

function onError(error) {
  alert(`Error: ${error.message}`);
}

async function handleFormSubmit(event) {
  event.preventDefault();
  
  const formNode = event.target;
  const data = serializeForm(formNode);

  console.log('Serialized data:', data); 

  toggleLoader();

  try {
    const response = await sendDataToPipedrive(data);

    console.log('Response:', response); 

    if (response && response.success) {
      onSuccess(formNode);
    } else {
      throw new Error('Pipedrive API error');
    }
  } catch (error) {
    onError(error);
  } finally {
    toggleLoader();
  }
}

function toggleLoader() {
  const loader = document.getElementById('loader');
  loader.classList.toggle('hidden_loader');
}

function checkValidity(event) {
  const formNode = event.target.form;
  const isValid = formNode.checkValidity();

  formNode.querySelector('button').disabled = !isValid;
}

applicantForm.addEventListener('input', checkValidity);
applicantForm.addEventListener('submit', handleFormSubmit);



// Open and close modal 


  

  openButton.addEventListener('click', () => {
    popup.classList.remove('hidden');
  });

  closeButton.addEventListener('click', () => {
    popup.classList.add('hidden');
  });

  window.addEventListener('click', (event) => {
    if (event.target === popup) {
      popup.classList.add('hidden');
    }
  });

 

///

const saveButton = document.getElementById('saveButton');

saveButton.addEventListener('click', () => {
  const formData = new FormData(applicantForm);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  localStorage.setItem('formData', JSON.stringify(data));
  alert('Form data saved!');
});

const savedData = JSON.parse(localStorage.getItem('formData'));
  if (savedData) {
    Object.keys(savedData).forEach(key => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = savedData[key];
      }
    });
  }

