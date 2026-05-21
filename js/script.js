document.addEventListener('DOMContentLoaded', () => {

    // БЛОКИРУЕМ МЕЛЬКАНИЕ - скрываем оба блока до проверки
    const guestDiv = document.getElementById('guestContent');
    const userDiv = document.getElementById('userContent');
    if (guestDiv) guestDiv.style.display = 'none';
    if (userDiv) userDiv.style.display = 'none';
    
    const burgerBtn = document.querySelector('.header__burger');
    const headerNav = document.querySelector('.header__nav');

    if (burgerBtn && headerNav) {
        burgerBtn.addEventListener('click', () => {
            headerNav.classList.toggle('header__nav--open');
        });
    }

    function getFavorites() {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    }

    function saveFavorites(favorites) {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    function addToFavorites(bookId, bookTitle, bookAuthor, bookTag, bookImage) {
        const favorites = getFavorites();
        if (!favorites.some(book => book.id === bookId)) {
            favorites.push({
                id: bookId,
                title: bookTitle,
                author: bookAuthor,
                tag: bookTag,
                image: bookImage
            });
            saveFavorites(favorites);
            return true;
        }
        return false;
    }

    function removeFromFavorites(bookId) {
        let favorites = getFavorites();
        favorites = favorites.filter(book => book.id !== bookId);
        saveFavorites(favorites);
    }

    function isFavorite(bookId) {
        const favorites = getFavorites();
        return favorites.some(book => book.id === bookId);
    }

    function updateFavButton(button, bookId) {
        if (isFavorite(bookId)) {
            button.textContent = 'В избранном';
            button.style.backgroundColor = '#e5e8eb';
        } else {
            button.textContent = 'В избранное';
            button.style.backgroundColor = '#ffffff';
        }
    }

    const favButtons = document.querySelectorAll('.book-card__button--fav');
    favButtons.forEach(btn => {
        const bookCard = btn.closest('.book-card');
        const bookTitle = bookCard.querySelector('.book-card__title').textContent;
        const bookAuthor = bookCard.querySelector('.book-card__author').textContent;
        const bookTag = bookCard.querySelector('.book-card__tag').textContent;
        const bookImg = bookCard.querySelector('.book-card__image').src;
        const bookId = bookTitle + bookAuthor;
        
        updateFavButton(btn, bookId);
        
        btn.addEventListener('click', () => {
            if (isFavorite(bookId)) {
                removeFromFavorites(bookId);
                btn.textContent = 'В избранное';
                btn.style.backgroundColor = '#ffffff';
            } else {
                addToFavorites(bookId, bookTitle, bookAuthor, bookTag, bookImg);
                btn.textContent = 'В избранном';
                btn.style.backgroundColor = '#e5e8eb';
            }
        });
    });

    const regForm = document.getElementById('regForm');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            let isValid = true;
            const username = document.getElementById('username');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');
            const agreement = document.getElementById('agreement');

            const errors = document.querySelectorAll('.form-group__error');
            errors.forEach(err => {
                err.style.display = 'none';
                err.textContent = 'Ошибка';
            });
            const agreementError = document.getElementById('agreementError');
            if (agreementError) agreementError.style.display = 'none';

            if (!username || username.value.trim() === '') {
                showError(username, 'Введите имя пользователя');
                isValid = false;
            }

            if (!email) {
                isValid = false;
            } else {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!re.test(String(email.value).toLowerCase())) {
                    showError(email, 'Введите корректный email');
                    isValid = false;
                }
            }

            if (!password) {
                isValid = false;
            } else if (password.value.length < 6) {
                showError(password, 'Пароль должен быть не менее 6 символов');
                isValid = false;
            }

            if (!confirmPassword) {
                isValid = false;
            } else if (password && password.value !== confirmPassword.value) {
                showError(confirmPassword, 'Пароли не совпадают');
                isValid = false;
            }

            if (!agreement || !agreement.checked) {
                if (agreementError) agreementError.style.display = 'block';
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            } else {
                localStorage.setItem('currentUser', username.value);
                localStorage.setItem('currentEmail', email.value);
                window.location.href = 'account.html';
                e.preventDefault();
            }
        });
    }

    function showError(input, msg) {
        if (!input) return;
        const group = input.closest('.form-group');
        if (group) {
            const errDiv = group.querySelector('.form-group__error');
            if (errDiv) {
                errDiv.textContent = msg;
                errDiv.style.display = 'block';
            }
        }
    }

    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'registration.html';
        });
    }

    const detailLinks = document.querySelectorAll('.book-card__button--primary');
    detailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '404.html';
        });
    });

    const searchForm = document.querySelector('.promo__search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchInput = document.querySelector('.promo__input');
            const searchQuery = searchInput.value.trim().toLowerCase();
            if (searchQuery) {
                localStorage.setItem('searchQuery', searchQuery);
                window.location.href = 'products.html';
            }
        });
    }

    // ========== КОД ТОЛЬКО ДЛЯ СТРАНИЦЫ КАТАЛОГА ==========
    const isProductsPage = window.location.pathname.includes('products.html');
    
    if (isProductsPage) {
        const catalogSearch = document.getElementById('catalogSearch');
        const catalogFilter = document.getElementById('catalogFilter');
        const catalogGrid = document.getElementById('catalogGrid');
        
        let allCards = [];
        let currentPageNum = 1;
        let cardsPerPage = 8;
        let totalPages = 1;
        
        function getAllCards() {
            if (catalogGrid) {
                allCards = Array.from(catalogGrid.querySelectorAll('.book-card'));
            }
        }
        
        function updateFilterAndPagination() {
            if (!catalogGrid) return;
            getAllCards();
            const searchValue = catalogSearch ? catalogSearch.value.trim().toLowerCase() : '';
            const filterValue = catalogFilter ? catalogFilter.value : 'all';
            
            allCards.forEach(card => {
                const title = card.getAttribute('data-title') || card.querySelector('.book-card__title').textContent.toLowerCase();
                const author = card.getAttribute('data-author') || card.querySelector('.book-card__author').textContent.toLowerCase();
                const tag = card.getAttribute('data-tag') || card.querySelector('.book-card__tag').textContent.toLowerCase();
                
                let matchesSearch = true;
                let matchesFilter = true;
                
                if (searchValue) {
                    matchesSearch = title.toLowerCase().includes(searchValue) || author.toLowerCase().includes(searchValue);
                }
                
                if (filterValue !== 'all') {
                    matchesFilter = tag === filterValue;
                }
                
                if (matchesSearch && matchesFilter) {
                    card.style.display = '';
                    card.setAttribute('data-visible', 'true');
                } else {
                    card.style.display = 'none';
                    card.setAttribute('data-visible', 'false');
                }
            });
            
            const visibleCards = allCards.filter(card => card.getAttribute('data-visible') === 'true');
            totalPages = Math.ceil(visibleCards.length / cardsPerPage);
            if (totalPages === 0) totalPages = 1;
            
            if (currentPageNum > totalPages) {
                currentPageNum = 1;
            }
            
            recreatePageNumbers();
            showPage(currentPageNum);
            
            const pagination = document.querySelector('.pagination');
            if (pagination) {
                if (visibleCards.length <= cardsPerPage) {
                    pagination.style.display = 'none';
                } else {
                    pagination.style.display = 'flex';
                }
            }
        }
        
        function showPage(page) {
            if (!catalogGrid) return;
            const visibleCards = allCards.filter(card => card.getAttribute('data-visible') === 'true');
            const start = (page - 1) * cardsPerPage;
            const end = start + cardsPerPage;
            
            allCards.forEach(card => {
                if (card.getAttribute('data-visible') === 'true') {
                    card.style.display = 'none';
                }
            });
            
            visibleCards.forEach((card, index) => {
                if (index >= start && index < end) {
                    card.style.display = '';
                }
            });
            
            const allPageBtns = document.querySelectorAll('.page-num');
            allPageBtns.forEach(btn => {
                const btnPage = parseInt(btn.textContent);
                if (btnPage === page) {
                    btn.classList.add('pagination__button--active');
                } else {
                    btn.classList.remove('pagination__button--active');
                }
            });
            
            currentPageNum = page;
        }
        
        function recreatePageNumbers() {
            const oldNumbers = document.querySelector('.pagination__numbers');
            if (oldNumbers) oldNumbers.remove();
            
            const visibleCards = allCards.filter(card => card.getAttribute('data-visible') === 'true');
            totalPages = Math.ceil(visibleCards.length / cardsPerPage);
            if (totalPages === 0) totalPages = 1;
            
            const pageNumbersDiv = document.createElement('div');
            pageNumbersDiv.className = 'pagination__numbers';
            
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.textContent = i;
                btn.classList.add('pagination__button', 'page-num');
                if (i === currentPageNum) {
                    btn.classList.add('pagination__button--active');
                }
                btn.addEventListener('click', () => {
                    currentPageNum = i;
                    showPage(currentPageNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                pageNumbersDiv.appendChild(btn);
            }
            
            const nextBtn = document.getElementById('nextPage');
            if (nextBtn && nextBtn.parentNode) {
                nextBtn.parentNode.insertBefore(pageNumbersDiv, nextBtn);
            }
        }
        
        if (catalogSearch) {
            catalogSearch.addEventListener('input', () => {
                currentPageNum = 1;
                updateFilterAndPagination();
            });
        }
        
        if (catalogFilter) {
            catalogFilter.addEventListener('change', () => {
                currentPageNum = 1;
                updateFilterAndPagination();
            });
        }
        
        const savedSearch = localStorage.getItem('searchQuery');
        if (savedSearch && catalogSearch) {
            catalogSearch.value = savedSearch;
            localStorage.removeItem('searchQuery');
        }
        
        if (catalogGrid) {
            getAllCards();
            updateFilterAndPagination();
        }

        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');

        if (prevPage) {
            prevPage.addEventListener('click', () => {
                if (currentPageNum > 1) {
                    currentPageNum--;
                    showPage(currentPageNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }

        if (nextPage) {
            nextPage.addEventListener('click', () => {
                if (currentPageNum < totalPages) {
                    currentPageNum++;
                    showPage(currentPageNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    }

    // ========== ЛИЧНЫЙ КАБИНЕТ ==========
    
    function checkAuth() {
        const currentUser = localStorage.getItem('currentUser');
        const guestContent = document.getElementById('guestContent');
        const userContent = document.getElementById('userContent');
        const userNameSpan = document.getElementById('userName');
        const userEmailSpan = document.getElementById('userEmail');
        const profileNameInput = document.getElementById('profileName');
        const profileEmailInput = document.getElementById('profileEmail');
        const favoritesGrid = document.getElementById('favoritesGrid');

        if (currentUser) {
            if (guestContent) guestContent.style.display = 'none';
            if (userContent) userContent.style.display = 'flex';
            if (userNameSpan) userNameSpan.textContent = currentUser;
            if (userEmailSpan) {
                const email = localStorage.getItem('currentEmail');
                userEmailSpan.textContent = email ? email : 'email@example.com';
            }
            if (profileNameInput) profileNameInput.value = currentUser;
            if (profileEmailInput) {
                const email = localStorage.getItem('currentEmail');
                profileEmailInput.value = email ? email : '';
            }
            
            if (favoritesGrid) {
                const favorites = getFavorites();
                if (favorites.length === 0) {
                    favoritesGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">У вас пока нет избранных книг</p>';
                } else {
                    favoritesGrid.innerHTML = '';
                    favorites.forEach(book => {
                        const bookCard = document.createElement('article');
                        bookCard.className = 'book-card';
                        bookCard.innerHTML = `
                            <div class="book-card__image-wrapper">
                                <img src="${book.image}" alt="Обложка" class="book-card__image">
                            </div>
                            <h3 class="book-card__title">${book.title}</h3>
                            <p class="book-card__author">${book.author}</p>
                            <span class="book-card__tag">${book.tag}</span>
                            <div class="book-card__buttons">
                                <button class="book-card__button book-card__button--primary">Подробнее</button>
                                <button class="book-card__button book-card__button--secondary book-card__button--fav-remove">Удалить</button>
                            </div>
                        `;
                        favoritesGrid.appendChild(bookCard);
                        
                        const removeBtn = bookCard.querySelector('.book-card__button--fav-remove');
                        removeBtn.addEventListener('click', () => {
                            removeFromFavorites(book.id);
                            checkAuth();
                        });
                        
                        const detailBtn = bookCard.querySelector('.book-card__button--primary');
                        detailBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            window.location.href = '404.html';
                        });
                    });
                }
            }
        } else {
            if (guestContent) guestContent.style.display = 'block';
            if (userContent) userContent.style.display = 'none';
        }
    }

    checkAuth();

    const myBooksLink = document.getElementById('myBooksLink');
    const settingsLink = document.getElementById('settingsLink');
    const myBooksSection = document.getElementById('myBooksSection');
    const settingsSection = document.getElementById('settingsSection');

    if (myBooksLink && settingsLink && myBooksSection && settingsSection) {
        myBooksLink.addEventListener('click', (e) => {
            e.preventDefault();
            myBooksLink.classList.add('dashboard__link--active');
            settingsLink.classList.remove('dashboard__link--active');
            myBooksSection.style.display = 'block';
            settingsSection.style.display = 'none';
        });

        settingsLink.addEventListener('click', (e) => {
            e.preventDefault();
            settingsLink.classList.add('dashboard__link--active');
            myBooksLink.classList.remove('dashboard__link--active');
            myBooksSection.style.display = 'none';
            settingsSection.style.display = 'block';
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentEmail');
            window.location.href = 'account.html';
        });
    }

    const accountForm = document.getElementById('accountForm');
    if (accountForm) {
        accountForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = document.getElementById('profileName');
            const newEmail = document.getElementById('profileEmail');
            if (newName && newName.value.trim()) {
                localStorage.setItem('currentUser', newName.value.trim());
            }
            if (newEmail && newEmail.value.trim()) {
                localStorage.setItem('currentEmail', newEmail.value.trim());
            }
            alert('Данные сохранены');
            window.location.href = 'account.html';
        });
    }

    const uploadBtn = document.getElementById('uploadAvatarBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const userAvatar = document.getElementById('userAvatar');

    function loadAvatar() {
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar && userAvatar) {
            userAvatar.style.backgroundImage = `url(${savedAvatar})`;
            userAvatar.style.backgroundSize = 'cover';
            userAvatar.style.backgroundPosition = 'center';
        } else if (userAvatar) {
            userAvatar.style.backgroundImage = '';
            userAvatar.style.backgroundColor = '#e0e0e0';
        }
    }

    if (uploadBtn && avatarUpload) {
        uploadBtn.addEventListener('click', () => {
            avatarUpload.click();
        });

        avatarUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const avatarData = event.target.result;
                    localStorage.setItem('userAvatar', avatarData);
                    loadAvatar();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    loadAvatar();
});