const navBtn = document.querySelector('.nav-btn');
const formCloseBtn = document.querySelector('.form-close-btn');
const formContainer = document.querySelector('.form-container');

function show() {
  formContainer.classList.toggle('toggleClose');
}

navBtn.addEventListener('click', show);
formCloseBtn.addEventListener('click', show);

function readFile(file) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException('Problem with file upload.'));
    };

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.readAsDataURL(file);
  });
}

const form = document.querySelector('form');

const library = [];
const obj = {};

function Book(title, author, pages, base64, isRead, date) {
  this.title = title;
  this.date = date;
  this.author = author;
  this.pages = pages;
  this.base64 = base64;
  this.isRead = isRead;
}

Book.prototype.toggleIsRead = function() {
  this.isRead = !this.isRead;
  localStorage.setItem('library', JSON.stringify(library));
};

function addBookToLibrary(book) {
  library.push(book);
  localStorage.setItem('library', JSON.stringify(library));
}

function removeFromLibrary(index) {
  library.splice(index, 1);
  localStorage.setItem('library', JSON.stringify(library));
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const inputs = document.querySelectorAll('.form-input');
  for (const input of inputs) {
    if (input.type === 'file') {
      const result = await readFile(input.files[0]);
      obj[input.id] = result;
    } else if (input.type === 'text') {
      obj[input.id] = input.value;
    } else {
      obj[input.id] = input.checked;
    }
  }
  addBookToLibrary(
    new Book(
      obj.title,
      obj.author,
      obj.pages,
      obj.base64,
      obj.isRead,
      obj.date,
    ),
  );
  clearFields();
  show();
  render();
});

// Helper
const create = (tag) => document.createElement(tag);

function render() {
  const cards = document.querySelector('.cards');
  cards.innerHTML = '';

  library.forEach((book, index) => {
    const { title, author, pages, base64, isRead, date } = book;
    const card = create('div');
    card.className = 'card';

    const cover = create('div');
    cover.className = 'cover';

    const img = create('img');
    img.src = base64;

    // Details

    const details = create('div');
    details.className = 'details';

    const bookTitle = create('h3');
    bookTitle.className = 'book-title';
    bookTitle.textContent = title;

    const bookAuthor = create('p');
    const bookAuthorSpan = create('span');

    bookAuthor.textContent = 'Author: ';
    bookAuthorSpan.textContent = author;

    const publishDate = create('p');
    const publishDateSpan = create('span');

    publishDate.textContent = 'Published in: ';
    publishDateSpan.textContent = date;

    const bookPages = create('p');
    const bookPagesSpan = create('span');

    bookPages.textContent = 'Pages: ';
    bookPagesSpan.textContent = pages;

    const didRead = create('p');
    didRead.textContent = isRead ? 'Read' : 'Did not read';

    // Actions

    const actions = create('div');
    actions.className = 'actions';

    const readButton = create('button');
    const removeButton = create('button');

    readButton.className = 'details-btn details-btn-outlined';
    readButton.textContent = isRead ? 'Unread' : 'Mark read';
    readButton.setAttribute('data-id', index);

    removeButton.className = 'details-btn details-btn-remove';
    removeButton.textContent = 'Remove';
    removeButton.setAttribute('data-id', index);

    readButton.addEventListener('click', (e) => {
      const { id } = e.target.dataset;
      library[id].toggleIsRead();
      render();
    });

    removeButton.addEventListener('click', (e) => {
      const { id } = e.target.dataset;
      removeFromLibrary(id);
      render();
    });
    actions.append(readButton, removeButton);

    // Appending

    bookAuthor.append(bookAuthorSpan);
    publishDate.append(publishDateSpan);
    bookPages.append(bookPagesSpan);

    cover.append(img);
    details.append(
      bookTitle,
      bookAuthor,
      publishDate,
      bookPages,
      didRead,
      actions,
    );

    card.append(cover, details);

    cards.append(card);
  });
}

function clearFields() {
  const inputs = document.querySelectorAll('.form-input');
  inputs.forEach((input) => (input.value = ''));
}

// Toggle form on ESC

window.addEventListener('keydown', (e) => {
  if (e.keyCode == 27) {
    show();
  }
});

// Get saved books from localStorage

window.onload = () => {
  const savedBooks = JSON.parse(localStorage.getItem('library'));
  if (savedBooks !== null) {
    savedBooks.forEach((book) => {
      library.push(
        new Book(
          book.title,
          book.author,
          book.pages,
          book.base64,
          book.isRead,
          book.date,
        ),
      );
    });
  }
  render();
};
