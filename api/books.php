<?php

header('Content-Type: application/json');

require_once '../config.php';
require_once 'src/db_connection.php';
require_once 'src/Book.php';
$conn = connectToDB();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['id'])) {
        $id = ($_GET['id']);
        $book = [];
        $book[] = Book::loadFromDB($conn, $id);
        $bookJS = json_encode($book);
        echo($bookJS);
    } else {
        $books = Book::loadAllFromDB($conn);
        $booksJS = json_encode($books);
        echo($booksJS);
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if ($_POST['name'] && $_POST['author'] && $_POST['description']) {
        $book = new Book($_POST['name'], $_POST['author'], $_POST['description']);
        $book->save($conn);
        $bookJS = json_encode(Book::loadFromDB($conn, $book->getId()));
        echo($bookJS);
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    parse_str(file_get_contents("php://input"), $del_vars);
    if (isset($del_vars['id'])) {
        Book:: deleteFromDB($conn, $del_vars['id']);
        echo(json_encode("Deleted"));
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    parse_str(file_get_contents("php://input"), $put_vars);
    if (isset($put_vars['id'])) {
        $book = new Book($put_vars['name'], $put_vars['author'], $put_vars['description'], $put_vars['id']);
        $book->save($conn);
        echo(json_encode("Updated"));
    }
}
