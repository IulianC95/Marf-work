document.addEventListener('DOMContentLoaded', function () {
  // Popularea dinamică a opțiunilor pentru asociații
  fetch('getAssociations.php')
    .then((response) => response.json())
    .then((data) => {
      const selectElement = document.getElementById('prop-asoc');
      data.forEach((name) => {
        const option = document.createElement('option');
        option.value = name;
        option.text = name;
        selectElement.add(option);
      });
    });
});
