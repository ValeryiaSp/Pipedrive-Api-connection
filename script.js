const applicantForm = document.getElementById('form');
const openButton = document.querySelector('[data-popup]');
const closeButton = document.querySelector('[data-close]');
const popup = document.querySelector('.popup');
const FIELDS_MAP = {
  FIRST_NAME: "7c2757ea34c0272d241fa15e3287ae8801c18e77",
  LAST_NAME: "cac1d98a5e69396b1603440d42427115b29697bb",
  PHONE: "6eb03ccd68132b929f54cec95422423c0f9b700f",
  EMAIL: "c20b48e18ed6c1143890c63e24edc79a9a35a800",
  ADDRESS: "c906d4ac27b7b12aabdbd90a626fef630ada8357",

  JOB_TYPE: "47850b0dc7437fb17b6e5c8d2c5bb6489e0b3ba7",
  JOB_SOURCE: "258e7fbc39f269c1ac4b601f96710bab9d214b36",
  JOB_DESCRIPTION: "b5d00dd33d764fbc9ccfa85dfedcf88e904acfa2",

  DATE: "12bf26ef5ed928a62f344927e5d7fbb917194c3e",
  START_TIME: "5d4f9b967055d6ad2a9cc7c2963753eb0a125772",
  END_TIME: "9f987549fa4f4eb21bb2c2f6f63404596a732c9a",

  TEST: "04d6efc277a8d3c455b632279d5eb8da38fda42a",
};

function serializeForm(formNode) {
  const formData = new FormData(formNode);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  return data; 
}



async function sendDataToPipedrive(data) {
  const pipedriveUrl = `https://vashey.pipedrive.com/v1/leads?api_token=ef2896f75dda62f084c508cde1bd4128dc83a805`;

  const fullName = `${data.firstName} ${data.lastName}`;
  const address = `${data.address}, ${data.city},${
    data.area ? ` ${data.area},` : ""
  } ${data.state} ${data.zip}`;
  const title = `${fullName}-${data.city}-${data.address}-${+new Date()}`;

  try {
    const response = await fetch(pipedriveUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        organization_id: 1,

        [FIELDS_MAP.FIRST_NAME]: data.firstName,
        [FIELDS_MAP.LAST_NAME]: data.lastName,
        [FIELDS_MAP.PHONE]: data.phone,
        [FIELDS_MAP.EMAIL]: data.email,
        [FIELDS_MAP.ADDRESS]: address,

         // If not selected - don't include in payload
        ...(data.jobType ? { [FIELDS_MAP.JOB_TYPE]: data.jobType } : {}),
        ...(data.jobSource ? { [FIELDS_MAP.JOB_SOURCE]: data.jobSource } : {}),
        [FIELDS_MAP.JOB_DESCRIPTION]: data.jobDescription,

        [FIELDS_MAP.DATE]: data.date,
        [FIELDS_MAP.START_TIME]: `${data.startTime}:00`,
        [FIELDS_MAP.END_TIME]: `${data.endTime}:00`,

        // If not selected - don't include in payload
        ...(data.test ? { [FIELDS_MAP.TEST]: data.test } : {}),
      }),
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
  alert("Form successfully sent");
  formNode.reset();
  localStorage.removeItem("formData");
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

