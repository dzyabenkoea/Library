let books = []

const booksInCache = localStorage.getItem('books')
let bookList = []
if (booksInCache) {
    bookList = JSON.parse(booksInCache)
}

function Book(id, title, author, isRead) {
    this.title = title
    this.author = author
    this.id = id
    this.isRead = isRead
}

Book.prototype.render = function () {
    return `
    <div class="book" data-id="${this.id}" data-is-read="${this.isRead.toString()}">
        <h1 class="book-title">${this.title}</h1>
        <h2 class="book-author">${this.author}</h2>
        <div data-read="false"></div>
        <button class="remove-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
        </button>
        <button class="read-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"/></svg>
        </button>
    </div>
    `
}

bookList.forEach(book => {
    books.push(new Book(book.id, book.title, book.author, book.isRead))
})

function save() {
    localStorage.setItem('books', JSON.stringify(books))
}

function addBookTolibrary(book) {
    books.push(book)
    const bookGrid = document.querySelector('.book-grid')
    save()
    bookGrid.insertAdjacentHTML('beforeend', book.render())
    document.querySelector(`.book[data-id="${book.id}"] .read-btn`).addEventListener('click', readCallback)
    document.querySelector(`.book[data-id="${book.id}"] .remove-btn`).addEventListener('click', removeCallback)
}

function removeBookFromLibrary(id) {
    const bookToRemove = books.find(el => id === el.id)
    if (bookToRemove !== undefined) {
        const bookHTML = document.querySelector(`.book[data-id='${bookToRemove.id}']`)
        bookHTML.remove()
    }
    books = books.filter(el => el !== bookToRemove)
    save()
}

function toggleBookRead(id) {
    const foundBook = books.find(el => id === el.id)
    const bookHTML = document.querySelector(`.book[data-id='${foundBook.id}']`)
    foundBook.isRead = !foundBook.isRead
    bookHTML.dataset.isRead = foundBook.isRead.toString()
    save()
}

function renderBooks() {
    const bookGrid = document.querySelector('.book-grid')
    let markup = ''
    books.forEach(book => {
        markup += book.render()
    })
    bookGrid.insertAdjacentHTML('afterbegin', markup)
}

function removeCallback(event) {
    const book = event.target.closest('.book')
    const bookId = book.dataset.id
    removeBookFromLibrary(bookId)
}

function readCallback(event) {
    toggleBookRead(event.target.closest('.book').dataset.id)
}

renderBooks()

document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', removeCallback)
})

document.querySelectorAll('.read-btn').forEach(button => {
    button.addEventListener('click', readCallback)
})

document.querySelector('#add-book-btn').addEventListener('click', (event) => {
    const form = document.querySelector('#book-add-form')
    if (form === null) {
        const templateNode = document.querySelector('#add-form').content.cloneNode(true)
        document.body.append(templateNode)

        const container = document.querySelector('.container')

        function addBookHandler(){
            const title = container.querySelector('#book-title').value
            const author = container.querySelector('#book-author').value
            addBookTolibrary(new Book(crypto.randomUUID(), title, author, false))
            container.remove()
        }

        function keyUp(event) {
            switch (event.code) {
                case 'Escape': {
                    container.remove()
                    document.removeEventListener('keyup', keyUp)
                    break;
                }
                case 'Enter': {
                    addBookHandler()
                    container.remove()
                    document.removeEventListener('keyup', keyUp)

                    break;
                }
            }
        }

        document.addEventListener('keyup', keyUp)
        document.querySelector('#form-add-book').addEventListener('click', addBookHandler)
        container.querySelector('form>input:first-of-type').focus()
    }
})
