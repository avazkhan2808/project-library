const navBtn = document.querySelector('.nav-btn');
const formCloseBtn = document.querySelector('.form-close-btn');
const formContainer = document.querySelector('.form-container');

function show() {
  this.classList.toggle('toggleClose');
}

navBtn.addEventListener('click', show.bind(formContainer));
formCloseBtn.addEventListener('click', show.bind(formContainer));

const fileInput = document.querySelector('.form-file-input');

fileInput.addEventListener('change', (e) => {
  readFile(e.target.files[0], (e) => {
    const base64 = e.target.result;
    return base64;
  });
});
function readFile(file, callback) {
  const reader = new FileReader();
  reader.onload = callback;
  reader.readAsDataURL(file);
}
const form = document.querySelector('form');

const library = [];
const obj = {};

function Book(title, author, pages, base64, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.base64 = base64;
  this.read = read;
}

function addBookToLibrary(book) {
  library.push(book);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputs = document.querySelectorAll('.form-input');
  inputs.forEach((input) => {
    if (input.type === 'file') {
      readFile(input.files[0], (e) => {
        obj[input.id] = e.target.result;
      });
    } else if (input.type === 'text') {
      obj[input.id] = input.value;
    } else {
      obj[input.id] = input.checked;
    }
  });
});
