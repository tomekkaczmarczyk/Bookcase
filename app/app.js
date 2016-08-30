$(function() {
    var titles = $("div#titles");
    var allBooks = $("#all_books");
    var oneBook = $("#one_book");
    var submit = $("#submit");
    var clear = $("#clear");
    var select = $("#select_titles");
    var textarea = $("textarea");
    var form = $("#edit_form");
    var confirmEdit = $("#edit_submit");

    //event that shows edit form and sends ajax to confirm updating book info
    confirmEdit.on("click", function(event) {
        event.preventDefault();
        var title = "name="+$("#edit_title").val();
        var author = "author="+$("#edit_author").val();
        var description = "description="+$("#edit_description").val();
        var idStr = "id="+$(this).data("id");
        var data = title+"&"+author+"&"+description+"&"+idStr;
        $.ajax({
            url: "api/books.php",
            type: "PUT",
            data: data,
            dataType: "json"
        }).done(function() {
                titles.children().remove();
                showAllBooks();
                selectUpdate();
            }
        ).fail(function () {
            console.log("fail")
        });
    })

    //shows one book by select
    select.on("change", function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        var id = $("select").val();
        form.css('visibility', 'hidden');
        titles.children().remove();
        var idStr = "id="+id;
        $.ajax({
            url: "api/books.php",
            type: "GET",
            data: idStr,
            dataType: "json"
        }).done(function(response) {
            response.forEach(function (resp) {
                var book = new Book(resp[0], resp[1], resp[2], resp[3]);
                    book.add();
                    book.addDelEvents();
                    book.addEditEvent();
                    addTitleEvents();
            })
        }).fail(function () {
            console.log("fail")
        });
    });

    //function that updates selection of titles
    function selectUpdate() {
        select.children().remove();
        $.ajax({
            url: "api/books.php",
            type: "GET",
            dataType: "json"
        }).done(function(response) {
            var li = "<option value='0'>Wybierz z listy, lub wpisz id</option>";
            select.append(li);
            response.forEach(function (resp) {
                var book = new Book(resp[0], resp[1], resp[2], resp[3]);
                var li = "<option value='" + book.id + "'>" + book.title + "</option>";
                select.append(li);
            })
        }).fail(function () {
            console.log("fail")
        });
    };

    //shows all books
    allBooks.on("click", function(event) {
        form.css('visibility', 'hidden');
        titles.children().remove();
        event.preventDefault();
        showAllBooks();
    });

    //shows one book by id typed by user (after pressing the button)
    oneBook.on("click", function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        var id = $("#id").val();
        form.css('visibility', 'hidden');
        titles.children().remove();
        showOneBook(id);
    });

    //clears titles list after pressing the button
    clear.on("click", function(event) {
        event.preventDefault();
        form.css('visibility', 'hidden');
        titles.children().remove();
        selectUpdate();
        });

    //creating a book in database after pressing the button (submit)
    submit.on("click", function(event) {
        event.preventDefault();
        form.css('visibility', 'hidden');
        var title = "name="+$("#title").val();
        var author = "author="+$("#author").val();
        var description = "description="+$("#description").val();
        var data = title+"&"+author+"&"+description;
        $.ajax({
            url: "api/books.php",
            type: "POST",
            data: data,
            dataType: "json"
        }).done(function() {
            titles.children().remove();
            showAllBooks();
        }).fail(function () {
            console.log("fail")

        });
        var inputs = $("form").find("input");
        inputs.val("");
        textarea.val("");
        selectUpdate();
    });

    Book = function(title, author, description, id) {
        this.title = title;
        this.author = author;
        this.description = description;
        this.id = id;
    };

    Book.prototype.add = function() {
        var emptyDiv = "<div class='book' data-id='"+this.id+"'></div>";
        var p = "<p class='book_title' data-id='"+this.id+"'>" + this.title + " - " + this.author + "</p>";
        var div = "<div class='info'>" + this.description + "</div>";
        var btn = "<button type='submit' class='del_btn' data-id='" + this.id + "'>usuń</button>";
        var editBtn = "<button type='submit' class='edit_btn'" +
            " data-title='" +this.title + "'" +
            " data-author='" +this.author + "'" +
            " data-description='" + this.description + "'" +
            " data-id='" + this.id + "'>edytuj</button>";
        titles.append(emptyDiv);
        titles.find("[data-id="+this.id+"]").first().append(p);
        titles.find("[data-id="+this.id+"]").first().append(btn);
        titles.find("[data-id="+this.id+"]").first().append(editBtn);
        //find("[data-id="+this.id+"]")
        titles.find("[data-id="+this.id+"]").first().append(div);
    };

    Book.prototype.addDelEvents = function() {
        var btn = $(".del_btn");
        btn.on("click", function() {
            form.css('visibility', 'hidden');
            var idStr = "id="+$(this).data("id");
            $.ajax({
                url: "api/books.php",
                type: "DELETE",
                data: idStr,
                dataType: "json"
            }).done(function() {
                titles.children().remove();
                showAllBooks();
                selectUpdate();
            }).fail(function () {
                console.log("fail")
            });
        })
    };

    //adding event to edit buttons - shows the book and the form for edition
    Book.prototype.addEditEvent = function() {
        var editBtn = $(".edit_btn");
        editBtn.on("click", function(event) {
            event.preventDefault();
            var id = $(this).data('id');
            var title = $(this).data('title');
            var author = $(this).data('author');
            var desc = $(this).data('description');
            $(this).after(form);
            form.css('visibility', 'visible');
            form.find('#edit_title').val(title);
            form.find('#edit_author').val(author);
            form.find('#edit_description').val(desc);
            confirmEdit.attr('data-id', id);
        })
    };

    //function is loading all books from database, creates Book object instance
    //  it's adding del button to every book and adds event on this button
    //  finaly function is adding event that hides/shows the discription of the book
    function showAllBooks() {
        $.ajax({
            url: "api/books.php",
            type: "GET",
            dataType: "json"
        }).done(function(response) {response.forEach(function(resp) {
            var book = new Book(resp[0], resp[1], resp[2], resp[3]);
            book.add();
            book.addDelEvents();
            book.addEditEvent();
            addTitleEvents();
        })
        }).fail(function () {
            console.log("fail")
        });
    }

    //function similar to showAllBooks - with the diference that it shows one book by given id
    function showOneBook(id) {
        var idStr = "id="+id;
        $.ajax({
            url: "api/books.php",
            type: "GET",
            data: idStr,
            dataType: "json"
        }).done(function(response) {
            response.forEach(function (resp) {
                var book = new Book(resp[0], resp[1], resp[2], resp[3]);
                if (resp[0] != null) {
                    book.add();
                    book.addDelEvents();
                    book.addEditEvent();
                    addTitleEvents();
                    selectUpdate();
                } else {
                    titles.append("<p>Brak książki o podanym id</p>");
                }
            })
        }).fail(function () {
                console.log("fail")
            });
    };

    function addTitleEvents() {
        var bookTitle = $(".book_title");
        bookTitle.on("click", function(event) {
            event.stopImmediatePropagation();
            var info = $(this).next().next().next();
            if ($(this).next().next().next().css('display') == 'none') {
                info.show();
            } else {
                info.hide();
            }
        })
    }
});
