let db;

const request = indexedDB.open("studentsDB", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;

    if (!db.objectStoreNames.contains("students")) {
        db.createObjectStore("students", {
            keyPath: "id",
            autoIncrement: true
        });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;

    console.log("БД успешно открыта");
    window.dispatchEvent(new Event("db-ready"));
};

request.onerror = function () {
    console.error("Ошибка при открытии БД");
};

function addStudent(student, callback) {
    const transaction = db.transaction("students", "readwrite");
    const store = transaction.objectStore("students");
    const request = store.add(student);

    request.onsuccess = function () {
        console.log("Студент добавлен");
        if (callback)
            callback();
    };

    request.onerror = function () {
        console.error("Ошибка при добавлении студента");
    };
}

function getAllStudents(callback) {
    const transaction = db.transaction("students", "readonly");
    const store = transaction.objectStore("students");
    const request = store.getAll();

    request.onsuccess = function () {
        callback(request.result);
    };

    request.onerror = function () {
        console.error("Ошибка при получении студентов");
    };
}

function getStudentById(id, callback) {
    const transaction = db.transaction("students", "readonly");
    const store = transaction.objectStore("students");
    const request = store.get(id);

    request.onsuccess = function () {
        callback(request.result);
    };

    request.onerror = function () {
        console.error("Ошибка при получении студентов");
    };
}

function updateStudent(student, callback) {
    const transaction = db.transaction("students", "readwrite");
    const store = transaction.objectStore("students");
    const request = store.put(student);

    request.onsuccess = function () {
        console.log("Студент обновлен");
        if (callback)
            callback();

    };

    request.onerror = function () {
        console.error("Ошибка при обновлении студента");
    };
}

function deleteStudent(id, callback) {
    const transaction = db.transaction("students", "readwrite");
    const store = transaction.objectStore("students");
    const request = store.delete(id);

    request.onsuccess = function () {
        console.log("Студент удалён");
        if (callback)
            callback();
    };

    request.onerror = function () {
        console.error("Ошибка при удалении студента");
    };
}
