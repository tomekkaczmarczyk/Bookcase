<?php header('Content-type: text/html; charset=utf-8');?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Bookstore</title>
</head>
<body>
<div class="container">
    <div class="book_form">
        <form method = 'POST'>
            <p>Formularz wpisu książki do bazy</p>
            <label for="title">Tytuł:</label>
                <input type="text" id="title">
            <label for="author">Autor:</label>
                <input type="text" id="author">
            <label for="description">Opis:</label>
                    <textarea id="description"></textarea>
            <button type="submit" id="submit">Zapisz</button>
        </form>
    </div>

    <div class="show_form">
        <form method = 'POST'>
            <label>Wybierz książkę
            <select id="select_titles">
                <option value="0">Wybierz z listy, lub wpisz id</option>
                <?php
                //creating select options for all titles from database
                require_once 'config.php';
                require_once 'api/src/db_connection.php';
                require_once 'api/src/Book.php';
                $conn = connectToDB();

                $books = Book::loadAllFromDB($conn);
                foreach ($books as $book){
                    echo "<option value='" . $book->getId() . "'>" . $book->getName() . "</option>";
                }
                ?>
            </select></label>
            <label>Id:
                <input type="number" step=1 min=0 id="id">
            </label>
            <button type="submit" id="one_book">Wyświetl</button>
            <button type="submit" id="all_books">Wyświetl wszystkie książki</button>
            <button type="submit" id="clear">Wyczyść</button>
        </form>
    </div>

    <div id="titles">

    </div>
    <div class="book_form" id="edit_form">
        <form method = 'POST'>
            <p>Formularz edycji</p>
            <label for="edit_title">Tytuł:</label>
            <input type="text" id="edit_title">
            <label for="edit_author">Autor:</label>
            <input type="text" id="edit_author">
            <label for="edit_description">Opis:</label>
            <textarea id="edit_description"></textarea>
            <button type="submit" id="edit_submit" data-id="0">Zapisz zmiany</button>
        </form>
    </div>

</div>
</body>
<script src="app/jquery-2.2.4.min.js"></script>
<script src="app/app.js"></script>
</html>