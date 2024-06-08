export const formValidate = (formData) => {
  const { name, phone, wishes } = formData;
  const errors = {};

  if (!name.trim()) {
    errors.name = 'Имя обязательно';
  } else if (name.lеngth < 3) {
    errors.name = 'Имя не должно быть меньше 3 символов';
  }

  const phoneRegex = /^\+?[0-9]{10,15}$/;
  if (!phone.trim()) {
    errors.phone = 'Телефон обязателен';
  } else if (!phoneRegex.test(phone.trim())) {
    errors.phone = 'Введите корректный номер телефона';
  }

  if (!wishes.trim() || wishes.length < 3) {
    errors.wishes = 'Введите ваше пожелание';
  }

  return errors;
};
