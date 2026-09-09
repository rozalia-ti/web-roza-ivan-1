window.addEventListener("db-ready", function () {
    function renderStudents() {
        getAllStudents(function (students) {
            const tbody = document.getElementById("students-table-body");
            tbody.innerHTML = "";

            students.forEach(function (student) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${student.fullName}</td>
                    <td>${student.group}</td>
                    <td>${student.isuId}</td>
                    <td>${student.dormitory}</td>
                    <td>${student.room}</td>
                    <td><a href="student-details.html?id=${student.id}" class="button button--small">Подробнее</a></td>
                    <td><a href="student-form.html?id=${student.id}" class="button button--small">Редактировать</a></td>
                    <td><button type="button" class="button button--small button--danger" data-id="${student.id}">Удалить</button></td>
                `;
                tbody.appendChild(row);
            });
        });
    }

    document.getElementById("students-table-body").addEventListener("click", function (event) {
        if (event.target.matches(".button--danger")) {
            const id = event.target.dataset.id;
            deleteStudent(Number(id), function() {
                renderStudents();
            });
        }
    });

    renderStudents();
});
