<?php

function connectToDB() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if (!$conn) {
        die("Błąd połączenia: " . $conn->connect_error);
    }

    return $conn;
};

