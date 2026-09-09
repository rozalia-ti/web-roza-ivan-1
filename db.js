let db;

function openDB() {
    return new Promise(function (resolve, reject) {
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
            resolve();
        };

        request.onerror = function () {
            console.error("Ошибка при открытии БД");
            reject("Не удалось открыть базу данных");
        };
    });
}

function addStudent(student) {
    return new Promise(function (resolve, reject) {
        const transaction = db.transaction("students", "readwrite");
        const store = transaction.objectStore("students");
        const request = store.add(student);

        request.onsuccess = function () {
            console.log("Студент добавлен");
            resolve(request.result);
        };

        request.onerror = function () {
            console.error("Ошибка при добавлении студента");
            reject("Ошибка при добавлении студента");
        };
    });
}

function getAllStudents() {
    return new Promise(function (resolve, reject) {
        const transaction = db.transaction("students", "readonly");
        const store = transaction.objectStore("students");
        const request = store.getAll();

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function () {
            console.error("Ошибка при получении студентов");
            reject("Ошибка при получении студентов");
        };
    });
}

function getStudentById(id) {
    return new Promise(function (resolve, reject) {
        const transaction = db.transaction("students", "readonly");
        const store = transaction.objectStore("students");
        const request = store.get(id);

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function () {
            console.error("Ошибка при получении студента");
            reject("Ошибка при получении студента");
        };
    });
}

function updateStudent(student) {
    return new Promise(function (resolve, reject) {
        const transaction = db.transaction("students", "readwrite");
        const store = transaction.objectStore("students");
        const request = store.put(student);

        request.onsuccess = function () {
            console.log("Студент обновлен");
            resolve(request.result);
        };

        request.onerror = function () {
            console.error("Ошибка при обновлении студента");
            reject("Ошибка при обновлении студента");
        };
    });
}

function deleteStudent(id) {
    return new Promise(function (resolve, reject) {
        const transaction = db.transaction("students", "readwrite");
        const store = transaction.objectStore("students");
        const request = store.delete(id);

        request.onsuccess = function () {
            console.log("Студент удалён");
            resolve();
        };

        request.onerror = function () {
            console.error("Ошибка при удалении студента");
            reject("Ошибка при удалении студента");
        };
    });
}
