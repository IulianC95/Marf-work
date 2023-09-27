document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.asoc-input');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(form);

    fetch('insert_data.php', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.get('name'),
        address:
          formData.get('street') +
          ', ' +
          formData.get('nr') +
          ', ' +
          formData.get('bloc') +
          ', ' +
          formData.get('localitate') +
          ', ' +
          formData.get('judet'),
        president: formData.get('president'),
        street: formData.get('street'),
        nr: formData.get('nr'),
        bloc: formData.get('bloc'),
        localitate: formData.get('localitate'),
        judet: formData.get('judet'),
        cif: formData.get('cif'),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  });
});

// tabs

const tabs = document.querySelector('.tabs');
const btns = document.querySelectorAll('.button');
const articles = document.querySelectorAll('.content');

tabs.addEventListener('click', (event) => {
  const id = event.target.dataset.id;

  if (id) {
    btns.forEach((btn) => {
      btn.classList.remove('live');
    });
    event.target.classList.add('live');
    articles.forEach((article) => {
      article.classList.remove('live');
    });
    const element = document.getElementById(id);
    element.classList.add('live');
  }
});
