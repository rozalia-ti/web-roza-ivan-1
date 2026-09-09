window.addEventListener("db-ready", function () {
    const params = new URLSearchParams(window.location.search);
    const studentId = params.get("id") ? Number(params.get("id")) : null;
    const form = document.getElementById("student-form");

    if (studentId) {
        getStudentById(studentId, function (student) {
            if (!student) return;

            form.elements["full-name"].value = student.fullName;
            form.elements["group"].value = student.group;
            form.elements["isu-id"].value = student.isuId;
            form.elements["dormitory"].value = student.dormitory;
            form.elements["room"].value = student.room;
            form.elements["settlement-date"].value = student.settlementDate;
            form.elements["foreign-student"].checked = student.isForeign;
            form.elements["notes"].value = student.notes;
        });
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const fullName = form.elements["full-name"].value.trim();

        if (/\d/.test(fullName)) {
            alert("ФИО не должно содержать цифры");
            return;
        }

        const student = {
            fullName: fullName,
            group: form.elements["group"].value.trim(),
            isuId: Number(form.elements["isu-id"].value),
            dormitory: Number(form.elements["dormitory"].value),
            room: Number(form.elements["room"].value),
            settlementDate: form.elements["settlement-date"].value,
            isForeign: form.elements["foreign-student"].checked,
            notes: form.elements["notes"].value.trim()
        };

        if (studentId) {
            student.id = studentId;
            updateStudent(student, function () {
                window.location.href = "index.html";
            });
        } else {
            addStudent(student, function () {
                window.location.href = "index.html";
            });
        }
    });
});
