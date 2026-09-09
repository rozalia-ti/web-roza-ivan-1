window.addEventListener("db-ready", function () {
    const params = new URLSearchParams(window.location.search);
    const studentId = Number(params.get("id"));

    getStudentById(studentId, function (student) {
        if (!student) {
            console.error("Студент не найден");
            return;
        }

        document.getElementById("details-full-name").textContent = student.fullName;
        document.getElementById("details-group").textContent = student.group;
        document.getElementById("details-isu-id").textContent = student.isuId;
        document.getElementById("details-dorm").textContent = student.dormitory;
        document.getElementById("details-room").textContent = student.room;
        document.getElementById("details-date").textContent = student.settlementDate;
        document.getElementById("details-foreign").textContent = student.isForeign ? "Да" : "Нет";
        document.getElementById("details-notes").textContent = student.notes || "—";
    });
});
