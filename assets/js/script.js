class Book {
    constructor(id, title, author, isRead) {
        this.id = id
        this.title = title
        this.author = author
        this.isRead = isRead
    }

    markRead(value) {
        this.isRead = value
    }

    render() {
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
}

class BookList {

    constructor() {
        this.books = []
        const booksInCache = localStorage.getItem('books')
        let bookList = []
        if (booksInCache) {
            bookList = JSON.parse(booksInCache)
            bookList.forEach(book => {
                this.books.push(new Book(book.id, book.title, book.author, book.isRead))
            })
        }
    }

    save() {
        localStorage.setItem('books', JSON.stringify(this.books))
    }

    addBookToLibrary(book) {
        this.books.push(book)
        const bookGrid = document.querySelector('.book-grid')
        this.save()
        bookGrid.insertAdjacentHTML('beforeend', book.render())

        const readButton = document.querySelector(`.book[data-id="${book.id}"] .read-btn`)
        readButton.addEventListener('click', this.readCallback.bind(this))
        const removeButton = document.querySelector(`.book[data-id="${book.id}"] .remove-btn`)
        removeButton.addEventListener('click', this.removeCallback.bind(this))
    }

    removeBookFromLibrary(id) {
        const bookToRemove = this.books.find(el => id === el.id)
        if (bookToRemove !== undefined) {
            const bookHTML = document.querySelector(`.book[data-id='${bookToRemove.id}']`)
            bookHTML.remove()
        }
        this.books = this.books.filter(el => el !== bookToRemove)
        this.save()
    }

    addBookHandler() {
        const container = document.querySelector('.container')
        const title = container.querySelector('#book-title').value
        const author = container.querySelector('#book-author').value
        this.addBookToLibrary(new Book(crypto.randomUUID(), title, author, false))
        container.remove()
    }

    keyUp(container, event) {
        switch (event.code) {
            case 'Escape': {
                container.remove()
                document.removeEventListener('keyup', this.keyUp)
                break;
            }
            case 'Enter': {
                this.addBookHandler()
                container.remove()
                document.removeEventListener('keyup', this.keyUp)
                break;
            }
        }
    }
    //
    // bookAdd(event) {
    //     const form = document.querySelector('#book-add-form')
    //     if (form === null) {
    //         const templateNode = document.querySelector('#add-form').content.cloneNode(true)
    //         document.body.append(templateNode)
    //
    //         const container = document.querySelector('.container')
    //         container.addEventListener('click', (event) => {
    //             if (event.target === container)
    //                 container.remove()
    //         }, true)
    //
    //         document.addEventListener('keyup', this.keyUp.bind(this, container))
    //         document.querySelector('#form-add-book').addEventListener('click', this.bookAdd.bind(this))
    //         container.querySelector('form>input:first-of-type').focus()
    //     }
    // }

    render() {
        let markup = ''
        this.books.forEach(book => {
            markup += book.render()
        })
        const bookGrid = document.querySelector('.book-grid')
        bookGrid.insertAdjacentHTML('afterbegin', markup)

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', this.removeCallback.bind(this))
        })

        document.querySelectorAll('.read-btn').forEach(button => {
            button.addEventListener('click', this.readCallback.bind(this))
        })

        document.querySelector('#add-book-btn').addEventListener('click', this.bookAdd.bind(this))

    }

    bookAdd(event) {
        const form = document.querySelector('#book-add-form')
        if (form === null) {
            const templateNode = document.querySelector('#add-form').content.cloneNode(true)
            document.body.append(templateNode)

            const container = document.querySelector('.container')
            container.addEventListener('click', (event) => {
                if (event.target === container)
                    container.remove()
            }, true)

            container.addEventListener('keyup', this.keyUp.bind(this, container))
            document.querySelector('#form-add-book').addEventListener('click', this.addBookConfirm.bind(this))
            container.querySelector('form>input:first-of-type').focus()
        }
    }

    addBookConfirm() {
        const container = document.querySelector('.container')
        const title = container.querySelector('#book-title').value
        const author = container.querySelector('#book-author').value
        this.addBookToLibrary(new Book(crypto.randomUUID(), title, author, false))
        container.remove()
    }

    toggleBookRead(id) {
        const foundBook = this.books.find(el => id === el.id)
        const bookHTML = document.querySelector(`.book[data-id='${foundBook.id}']`)
        foundBook.isRead = !foundBook.isRead
        bookHTML.dataset.isRead = foundBook.isRead.toString()
        this.save()
    }

    removeCallback(event) {
        const book = event.target.closest('.book')
        const bookId = book.dataset.id
        this.removeBookFromLibrary(bookId)
    }

    readCallback(event) {
        this.toggleBookRead(event.target.closest('.book').dataset.id)
    }
}

// main part
const bl = new BookList()
bl.render()