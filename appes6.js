//book constructor
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//ui constructor
class UI {
  AddBookToList(book) {
    const list = document.getElementById("book-list");
    //create a row
    const row = document.createElement("tr");
    //append td
    row.innerHTML = `<td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href='#' class="delete">X</a></td>`;

    list.appendChild(row);
  }
  clearfields = function () {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  };

  showalert(message, className) {
    //create alert
    const alert = document.createElement("div");
    alert.className = `alert ${className}`;
    alert.appendChild(document.createTextNode(message));

    //get parents
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");

    container.insertBefore(alert, form);

    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  //delete book
  deleteBook(target) {
    if (target.classList.contains("delete")) {
      target.parentElement.parentElement.remove();
    }
  }
}

// work with local-storage

class store {
  static getBook() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static displayBook() {
    const books = store.getBook();
    const ui = new UI();
    books.forEach((book) => {
      ui.AddBookToList(book);
    });
  }
  static addBook(book) {
    const books = store.getBook();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(target) {
    const books = store.getBook();
    const ui = new UI();
    books.forEach(function (book, index) {
      if (target === book.isbn) {
        books.splice(index);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

//add to ui from local storage
document.addEventListener("DOMContentLoaded", store.displayBook());
//event listners
document.getElementById("book-form").addEventListener("submit", function (e) {
  //get values
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  //instantiate book
  const book = new Book(title, author, isbn);

  //instanatiate ui
  const ui = new UI();
  if (title === "" || author === "" || isbn === "") {
    ui.showalert("please fill all the required field", "error");
  } else {
    //add book
    ui.AddBookToList(book);
    //add book to storage
    store.addBook(book);
    //shoe success message
    ui.showalert("book added", "success");
  }

  //clear fields
  ui.clearfields();
  e.preventDefault();
});

//delete a book form list
document.querySelector(".table").addEventListener("click", function (e) {
  const ui = new UI();
  //delete book
  ui.deleteBook(e.target);
  store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  ui.showalert("book deleted", "success");
  e.preventDefault();
});
