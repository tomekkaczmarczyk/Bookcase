<?php

class Book implements JsonSerializable
{
    private $id;
    private $name;
    private $author;
    private $description;

    public function __construct($name = "", $author = "", $description = "", $id = -1)
    {
        $this->id = $id;
        $this->name = $name;
        $this->author = $author;
        $this->description = $description;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getAuthor()
    {
        return $this->author;
    }

    public function setAuthor($author)
    {
        $this->author = $author;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public static function loadFromDB($conn, $id)
    {

        $query = "SELECT * FROM books WHERE `id` = $id";

        $result = $conn->query($query);

        $row = $result->fetch_assoc();

        $book = new Book(
            $row['name'],
            $row['author'],
            $row['description'],
            $row['id']
        );

        return $book;
    }

    public static function loadAllFromDB($conn)
    {

        $query = "SELECT * FROM books";

        $result = $conn->query($query);
        if (!$result) {
            die("Błąd: " . $conn->error);
        }

        $books = [];
        foreach ($result as $book) {
            $bookObj = new Book(
                $book['name'],
                $book['author'],
                $book['description'],
                $book['id']
            );
            $books[] = $bookObj;
        }

        return $books;
    }

    public function save($conn)
    {
        if ($this->id == -1) {
            $query = "INSERT INTO books (`name`, `author`, `description`) VALUES ('{$this->name}', '{$this->author}', '{$this->description}')";
        } else {
            $query = "UPDATE books SET `name`='{$this->name}', `author`='{$this->author}', `description`='{$this->description}' WHERE `id` = '{$this->id}'";
        }
        $result = $conn->query($query);

        if (!$result) {
            return false;
        }

        return true;
    }

    public static function deleteFromDB($conn, $id)
    {
        if ($id == -1) {
            return false;
        }

        $query = "DELETE FROM books WHERE `id` = '$id';";
        $result = $conn->query($query);

        if (!$result) {
            return false;
        }

        return true;
    }


    function jsonSerialize()
    {
        return [$this->name, $this->author, $this->description, $this->id];
    }
}

;