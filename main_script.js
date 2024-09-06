async function sendDataToPipedrive() {
  const apiKey = "8089deab80c6c691b2ca74a01f97a0feb8fd3f12";
  const data = {
    title: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
    value: 0,
    person_id: null,
    person_first_name: document.getElementById('firstName').value,
    person_last_name: document.getElementById('lastName').value,
    person_phone: document.getElementById('phone').value,
    person_email: document.getElementById('email').value,
    job_type: document.getElementById('jobType').value,
    job_source: document.getElementById('jobSource').value,
    job_description: document.getElementById('jobDescription').value,
    adress: document.getElementById('adress').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    zip: document.getElementById('zip').value,
    area: document.getElementById('area').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    end: document.getElementById('end').value,
    test: document.getElementById('test').value,
};
const url = `https://api.pipedrive.com/v1/deals?api_token=${apiKey}`;

try {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Data sussesfuly sent to Pipedrive!');
  } else {
      console.error('Error with data sending:', response.statusText);
  }
} catch (error) {
  console.error('Error happend:', error);
}
}