const DB_NAME = "StudentDB";
const STORE_NAME = "students";

let db;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = function (event) {
      const database = event.target.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = function (event) {
      db = event.target.result;
      resolve();
    };

    request.onerror = function () {
      reject("Не удалось открыть базу данных");
    };
  });
}

function makeRequest(mode, action) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = action(store);

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject("Ошибка работы с базой данных");
    };
  });
}

function getAllStudents() {
  return makeRequest("readonly", (store) => store.getAll());
}

function getStudentById(id) {
  return makeRequest("readonly", (store) => store.get(id));
}

function addStudent(student) {
  return makeRequest("readwrite", (store) => store.add(student));
}

function updateStudent(student) {
  return makeRequest("readwrite", (store) => store.put(student));
}

function deleteStudent(id) {
  return makeRequest("readwrite", (store) => store.delete(id));
}
