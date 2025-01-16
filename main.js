
let books = [];

const bookForm = document.getElementById("bookForm");
const searchBookForm = document.getElementById("searchBook");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");
const bookFormSubmitButton = document.getElementById("bookFormSubmit");
const bookFormIsCompleteCheckbox = document.getElementById("bookFormIsComplete");

function saveToLocalStorage() {
    localStorage.setItem("books", JSON.stringify(books));
}

function loadFromLocalStorage() {
    const storedBooks = localStorage.getItem("books");
    if (storedBooks) {
        books = JSON.parse(storedBooks);
        books.forEach((book) => {
            renderBook(book);
        });
    }
}

function renderBook(book) {

    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");
    bookElement.className = "book-style";


    const bookTitle = document.createElement("h3");
    bookTitle.setAttribute("data-testid", "bookItemTitle");
    bookTitle.textContent = book.title;


    const bookAuthor = document.createElement("p");
    bookAuthor.setAttribute("data-testid", "bookItemAuthor");
    bookAuthor.textContent = `Penulis: ${book.author}`;

    const bookYear = document.createElement("p");
    bookYear.setAttribute("data-testid", "bookItemYear");
    bookYear.textContent = `Tahun: ${book.year}`;

    const actionContainer = document.createElement("div");

    const toggleButton = document.createElement("button");
    toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    toggleButton.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
    toggleButton.addEventListener("click", () => toggleBookStatus(book.id));

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.textContent = "Hapus Buku";
    deleteButton.addEventListener("click", () => removeBook(book.id));

    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.textContent = "Edit Buku";
    editButton.addEventListener("click", () => editBook(book.id));

    actionContainer.append(toggleButton, deleteButton, editButton);

    bookElement.append(bookTitle, bookAuthor, bookYear, actionContainer);

    if (book.isComplete) {
        completeBookList.appendChild(bookElement);
    } else {
        incompleteBookList.appendChild(bookElement);
    }
}

function addBook(event) {
    event.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value);
    const isComplete = bookFormIsCompleteCheckbox.checked;

    const newBook = {
        id: +new Date(),
        title,
        author,
        year,
        isComplete,
    };

    books.push(newBook);

    saveToLocalStorage();

    renderBook(newBook);

    bookForm.reset();
    updateSubmitButtonText();
}

function removeBook(bookId) {

    books = books.filter((book) => book.id !== bookId);

    saveToLocalStorage();

    const bookElement = document.querySelector(`[data-bookid="${bookId}"]`);
    if (bookElement) {
        bookElement.remove();
    }
}

function toggleBookStatus(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {

        book.isComplete = !book.isComplete;

        saveToLocalStorage();

        incompleteBookList.innerHTML = "";
        completeBookList.innerHTML = "";
        books.forEach((book) => renderBook(book));
    }
}

function editBook(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {
        
        document.getElementById("bookFormTitle").value = book.title;
        document.getElementById("bookFormAuthor").value = book.author;
        document.getElementById("bookFormYear").value = book.year;
        bookFormIsCompleteCheckbox.checked = book.isComplete;

        removeBook(bookId);
    }
}

function searchBook(event) {
    event.preventDefault();

    const query = document.getElementById("searchBookTitle").value.toLowerCase();

    const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(query));

    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
    filteredBooks.forEach((book) => renderBook(book));
}

function updateSubmitButtonText() {
    const span = bookFormSubmitButton.querySelector("span");
    span.textContent = bookFormIsCompleteCheckbox.checked
        ? "Telah Selesai dibaca"
        : "Belum selesai dibaca";
}

bookFormIsCompleteCheckbox.addEventListener("change", updateSubmitButtonText);

bookForm.addEventListener("submit", addBook);

searchBookForm.addEventListener("submit", searchBook);

loadFromLocalStorage();
