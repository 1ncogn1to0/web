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
            } else if (data.token) {
                // Сохраняем токен в localStorage после успешной верификации OTP
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);  // Сохраняем имя

                window.location.href = '/home.html'; // Перенаправление на домашнюю страницу
            } 
            else {
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

            if (data.token) {
                localStorage.setItem('token', data.token);  // Сохраняем JWT
                localStorage.setItem('username', data.username); // Сохраняем имя
                alert('Авторизация успешна!');
                window.location.href = '/home.html';
            }

            else {
                alert(data.error || 'Ошибка верификации OTP.');
            }
        } catch (error) {
            console.error('Ошибка верификации OTP:', error);
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', async () => {
        const sessionToken = localStorage.getItem('sessionToken'); // Получаем сессионный токен из локального хранилища
        
        if (sessionToken) {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: sessionToken }) // Отправляем токен на сервер
            });

            // Удаляем токены из локального хранилища
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('sessionToken');
            window.location.href = 'index.html'; // Перенаправляем на главную страницу
        }
    });

});