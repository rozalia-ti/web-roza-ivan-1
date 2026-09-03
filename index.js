const main = document.querySelector(".main");
const listElements = Array.from(main.children);

document.addEventListener("DOMContentLoaded", start);

async function start() {
  try {
    await openDB();
    await renderStudents();
  } catch (error) {
    alert(error);
  }

  main.addEventListener("click", handleClick);
}

async function renderStudents() {
  const body = document.getElementById("students-table-body");
  const students = await getAllStudents();

  body.innerHTML = "";

  if (students.length === 0) {
    body.innerHTML = '<tr><td colspan="8">Студентов пока нет</td></tr>';
    return;
  }

  for (const student of students) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(student.fullName)}</td>
      <td>${escapeHtml(student.group)}</td>
      <td>${escapeHtml(student.isuId)}</td>
      <td>№${escapeHtml(student.dormNumber)}</td>
      <td>${escapeHtml(student.room)}</td>
      <td><button type="button" class="button button--small" data-action="details" data-id="${student.id}">Подробнее</button></td>
      <td><button type="button" class="button button--small" data-action="edit" data-id="${student.id}">Редактировать</button></td>
      <td><button type="button" class="button button--small button--danger" data-action="delete" data-id="${student.id}">Удалить</button></td>
    `;
    body.appendChild(row);
  }
}

async function handleClick(event) {
  const element = event.target.closest("button");
  if (!element) return;

  const action = element.dataset.action;

  if (action === "add") {
    await showForm();
  }

  if (action === "edit") {
    await showForm(Number(element.dataset.id));
  }

  if (action === "details") {
    await showDetails(Number(element.dataset.id));
  }

  if (action === "delete") {
    await removeStudent(Number(element.dataset.id));
  }

  if (action === "back") {
    showList();
    await renderStudents();
  }
}

async function showForm(id) {
  const view = await loadTemplate("student-form.html");
  const form = view.querySelector("#student-form");

  if (id) {
    const student = await getStudentById(id);
    if (!student) return;

    view.querySelector("#form-title").textContent = "Редактировать студента";
    view.querySelector("#student-id").value = student.id;
    view.querySelector("#fullName").value = student.fullName;
    view.querySelector("#group").value = student.group;
    view.querySelector("#isuId").value = student.isuId;
    view.querySelector("#dormNumber").value = student.dormNumber;
    view.querySelector("#room").value = student.room;
    view.querySelector("#checkInDate").value = student.checkInDate;
    view.querySelector("#isForeigner").checked = student.isForeigner;
    view.querySelector("#notes").value = student.notes || "";
    view.querySelector("#student-preview").innerHTML = studentTableHtml(student);
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const student = {
      fullName: view.querySelector("#fullName").value.trim(),
      group: view.querySelector("#group").value.trim(),
      isuId: view.querySelector("#isuId").value.trim(),
      dormNumber: view.querySelector("#dormNumber").value,
      room: view.querySelector("#room").value,
      checkInDate: view.querySelector("#checkInDate").value,
      isForeigner: view.querySelector("#isForeigner").checked,
      notes: view.querySelector("#notes").value.trim(),
    };

    const errors = validateStudent(student);
    const errorsElement = view.querySelector("#form-errors");

    if (errors.length > 0) {
      errorsElement.textContent = errors.join(". ");
      return;
    }

    if (id) {
      student.id = id;
      await updateStudent(student);
    } else {
      await addStudent(student);
    }

    showList();
    await renderStudents();
  });
}

async function showDetails(id) {
  const student = await getStudentById(id);
  if (!student) return;

  const view = await loadTemplate("student-details.html");
  const details = view.querySelector("#student-details");

  details.innerHTML = studentTableHtml(student);
}

async function removeStudent(id) {
  const student = await getStudentById(id);
  if (!student) return;

  if (confirm(`Удалить студента ${student.fullName}?`)) {
    await deleteStudent(id);
    await renderStudents();
  }
}

async function loadTemplate(fileName) {
  const response = await fetch(fileName);
  if (!response.ok) {
    throw new Error("Не удалось загрузить шаблон");
  }

  listElements.forEach((element) => {
    element.hidden = true;
  });

  const oldView = document.getElementById("dynamic-view");
  if (oldView) oldView.remove();

  const view = document.createElement("div");
  view.id = "dynamic-view";
  view.innerHTML = await response.text();
  main.appendChild(view);
  return view;
}

function showList() {
  document.getElementById("dynamic-view")?.remove();
  listElements.forEach((element) => {
    element.hidden = false;
  });
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = String(value);
  return element.innerHTML;
}

function studentTableHtml(student) {
  return `
    <table>
      <tbody>
        <tr><td>ФИО студента</td><td>${escapeHtml(student.fullName)}</td></tr>
        <tr><td>Группа</td><td>${escapeHtml(student.group)}</td></tr>
        <tr><td>ИСУ ID</td><td>${escapeHtml(student.isuId)}</td></tr>
        <tr><td>Номер общежития</td><td>${escapeHtml(student.dormNumber)}</td></tr>
        <tr><td>Комната</td><td>${escapeHtml(student.room)}</td></tr>
        <tr><td>Срок заселения</td><td>${escapeHtml(student.checkInDate)}</td></tr>
        <tr><td>Иностранец</td><td>${student.isForeigner ? "Да" : "Нет"}</td></tr>
        <tr><td>Заметки</td><td>${escapeHtml(student.notes || "Нет")}</td></tr>
      </tbody>
    </table>
  `;
}
