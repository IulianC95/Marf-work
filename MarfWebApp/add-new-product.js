document.addEventListener('DOMContentLoaded', function () {
  // Partea de adăugare a produselor suplimentare
  const addProductButton = document.querySelector('.add-product');
  const productContainer = document.querySelector('.product-container');

  addProductButton.addEventListener('click', function (e) {
    e.preventDefault();
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.name = 'product';
    newInput.title = 'Produs sau serviciu adițional';
    newInput.classList.add('form-control');
    newInput.classList.add('mt-2');
    productContainer.appendChild(newInput);
  });

  // Partea de adăugare a fișierelor suplimentare
  const addFileButton = document.querySelector('.add-file');
  const fileContainer = document.querySelector('.file-container');

  addFileButton.addEventListener('click', function (e) {
    e.preventDefault();
    const newInput = document.createElement('input');
    newInput.type = 'file';
    newInput.name = 'uploadedFile';
    newInput.title = 'Încarcă un fișier adițional';
    newInput.classList.add('form-control');
    newInput.classList.add('mt-2');
    fileContainer.appendChild(newInput);
  });
});
