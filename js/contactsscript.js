// Инициализация EmailJS (замените YOUR_USER_ID на ваш реальный User ID из EmailJS)
emailjs.init('service_s8exece');

// Обработчик отправки формы
document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Показываем индикатор загрузки
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';

    // Собираем данные формы
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value || 'Без темы',
        message: document.getElementById('message').value
    };

    // Отправляем через EmailJS
    emailjs.send('service_s8exece', 'contact_form', formData)
        .then(function() {
            // Успех
            alert('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
            document.getElementById('feedbackForm').reset();
        }, function(error) {
            // Ошибка
            console.error('Ошибка EmailJS:', error);
            alert('Ошибка при отправке. Попробуйте позже или напишите нам напрямую на 25online@mail.ru');
        })
        .finally(function() {
            // Восстанавливаем кнопку
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
});
