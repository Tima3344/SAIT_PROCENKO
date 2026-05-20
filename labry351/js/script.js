document.addEventListener('DOMContentLoaded', () => {
    
    const burgerBtn = document.querySelector('.header__burger');
    const headerNav = document.querySelector('.header__nav');

    if (burgerBtn && headerNav) {
        burgerBtn.addEventListener('click', () => {
            headerNav.classList.toggle('header__nav--open');
        });
    }

    const regForm = document.getElementById('regForm');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            let isValid = true;
            const username = document.getElementById('username');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');
            const agreement = document.getElementById('agreement');

            document.querySelectorAll('.form-group__error').forEach(err => err.style.display = 'none');

            if (username.value.trim() === '') {
                showError(username, 'Введите имя пользователя');
                isValid = false;
            }

            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!re.test(String(email.value).toLowerCase())) {
                showError(email, 'Введите корректный email');
                isValid = false;
            }

            if (password.value.length < 6) {
                showError(password, 'Пароль должен быть от 6 символов');
                isValid = false;
            }

            if (password.value !== confirmPassword.value) {
                showError(confirmPassword, 'Пароли не совпадают');
                isValid = false;
            }

            if (!agreement.checked) {
                document.getElementById('agreementError').style.display = 'block';
                isValid = false;
            }

            if (!isValid) e.preventDefault();
        });
    }

    function showError(input, msg) {
        const group = input.closest('.form-group');
        if (group) {
            const errDiv = group.querySelector('.form-group__error');
            errDiv.textContent = msg;
            errDiv.style.display = 'block';
        }
    }

    const favButtons = document.querySelectorAll('.book-card__button--fav');
    favButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.textContent === 'В избранное') {
                btn.textContent = 'В избранном';
                btn.style.backgroundColor = '#e5e8eb';
            } else {
                btn.textContent = 'В избранное';
                btn.style.backgroundColor = '#ffffff';
            }
        });
    });
});