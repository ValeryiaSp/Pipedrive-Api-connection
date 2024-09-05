function initializeDropdowns() {
  const dropdownContainers = document.querySelectorAll('.dropdown-container');

  dropdownContainers.forEach(container => {
    const input = container.querySelector('.dropdown-input');
    const options = container.querySelectorAll('.dropdown-options div');

    input.addEventListener('click', function() {
      container.classList.toggle('active');
  });

  options.forEach(option => {
    option.addEventListener('click', function() {
        input.value = this.textContent;
        container.classList.remove('active');
    });
});

document.addEventListener('click', function(event) {
  if (!container.contains(event.target)) {
      container.classList.remove('active');
  }
});
});
}

initializeDropdowns();