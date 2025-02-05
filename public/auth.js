//auth.js (public)
document.addEventListener('DOMContentLoaded', () => {
    // Регистрация
    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('regEmail').value.trim();
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value.trim();

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await res.json();
            console.log('Регистрация:', data);
            alert(data.message || data.error);

            if (data.message === 'Пользователь успешно зарегистрирован') {
                sessionStorage.setItem('email', email); // Сохраняем email для OTP
                console.log('Email сохранен в sessionStorage:', email); // Логирование email
                window.location.href = '/login.html'; // Перенаправление на страницу входа
            }
            

        } catch (error) {
            console.error('Ошибка регистрации:', error);
            alert('Произошла ошибка при регистрации');
        }
    });

    // Вход
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();  // Заменить на email
        const password = document.getElementById('loginPassword').value.trim();

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),  // Отправляем email вместо username
            });

            const data = await res.json();
            console.log('Логин:', data);

            if (data.message === 'OTP отправлен на ваш email') {
                // Сохраняем email в sessionStorage после успешного логина
                sessionStorage.setItem('email', data.email);
                document.getElementById('otpForm').style.display = 'block'; // Показываем форму для OTP
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Ошибка входа:', error);
            alert('Ошибка входа');
        }
    });

    // Верификация OTP
    document.getElementById('otpForm')?.addEventListener('submit', async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку

        const otp = document.getElementById('otp').value.trim();
        const email = sessionStorage.getItem('email'); // ✅ Берём email из sessionStorage

        if (!email) {
            alert('Email не найден в sessionStorage. Пожалуйста, убедитесь, что вы прошли регистрацию.');
            return;
        }

        try {
            const res = await fetch('/api/auth/verify-otp', { // ✅ Правильный путь
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();
            if (data.message === 'OTP успешно подтвержден') {
                alert('Двухфакторная аутентификация прошла успешно!');
                sessionStorage.removeItem('email'); // Удаляем email после верификации
                window.location.href = '/home.html'; // Перенаправление
            } else {
                alert(data.error || 'Ошибка верификации OTP.');
            }
        } catch (error) {
            console.error('Ошибка верификации OTP:', error);
        }
    });
});