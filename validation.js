function validateStudent(student) {
  const errors = [];

  if (student.fullName.trim().length < 2) {
    errors.push("Введите ФИО студента");
  }

  if (!/^[A-Za-zА-Яа-я][0-9]{4}$/.test(student.group)) {
    errors.push("Группа: одна буква и 4 цифры, например P3211");
  }

  if (!/^[345][0-9][1-5][0-9]{3}$/.test(student.isuId)) {
    errors.push("ИСУ ID: 6 цифр, начинается с 3, 4 или 5; третья цифра от 1 до 5");
  }

  if (!Number.isInteger(Number(student.dormNumber)) || Number(student.dormNumber) < 1) {
    errors.push("Номер общежития должен быть положительным числом");
  }

  if (!Number.isInteger(Number(student.room)) || Number(student.room) < 1) {
    errors.push("Номер комнаты должен быть положительным числом");
  }

  if (!student.checkInDate || student.checkInDate < "2020-01-01") {
    errors.push("Срок заселения должен быть не ранее 2020 года");
  }

  return errors;
}
