document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.querySelector('.Titlu');
    titleElement.style.color = 'blue';

    titleElement.addEventListener('click', (event) => {
        titleElement.classList.add('highlight');
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            alert('Tasta Enter a fost apăsată');
        }
    });

    setTimeout(() => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        document.body.style.backgroundColor = `#${randomColor}`;
    }, 3000);

    setInterval(() => {
        const date = new Date();
        console.log(date.toLocaleTimeString());
    }, 5000);

    const computedStyle = getComputedStyle(titleElement);
    console.log(computedStyle.color);

    titleElement.addEventListener('click', (event) => {
        event.stopPropagation();
        console.log('Click pe titlu');
    });

    document.body.addEventListener('click', () => {
        console.log('Click pe body');
    });

    if (window.location.pathname.includes('galerie.html')) {
        const gallery = document.querySelector('.photo-gallery');
        const images = gallery.querySelectorAll('img');
        let currentIndex = 0;
        let interval;

        function showImage(index) {
            images[currentIndex].classList.remove('visible');
            currentIndex = (index + images.length) % images.length;
            images[currentIndex].classList.add('visible');
        }

        function showNextImage() {
            showImage(currentIndex + 1);
        }

        function showPrevImage() {
            showImage(currentIndex - 1);
        }

        function resetTimer() {
            clearInterval(interval);
            interval = setInterval(showNextImage, 3000);
        }

        document.getElementById('nextButton').addEventListener('click', () => {
            showNextImage();
            resetTimer();
        });

        document.getElementById('prevButton').addEventListener('click', () => {
            showPrevImage();
            resetTimer();
        });

        images[currentIndex].classList.add('visible');

        interval = setInterval(showNextImage, 3000);
    }

    if (window.location.pathname.includes('galerie.html')) {
        const beerImage = document.getElementById('timisoreana');
        if (beerImage) {
            beerImage.remove();
        }
    }

    if (window.location.pathname.includes('istorie.html')) {
        const beerImage = document.getElementById('timisoreana');
        if (beerImage) {
            beerImage.style.opacity = '0.5';
            beerImage.style.transform = 'rotate(45deg)';
            beerImage.style.transition = 'all 0.5s ease';
        }
    }

    const questionForm = document.getElementById('questionForm');
    if (questionForm) {
        questionForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const age = document.getElementById('age').value;
            const email = document.getElementById('email').value;
            const question = document.getElementById('question').value;

            const namePattern = /^[A-Za-z\s]+$/;
            const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

            if (!namePattern.test(name)) {
                alert('Nume invalid. Sunt permise doar litere și spații.');
                return;
            }

            if (!emailPattern.test(email)) {
                alert('Format de email invalid.');
                return;
            }

            const questions = JSON.parse(localStorage.getItem('questions')) || [];
            questions.push({ name, age, email, question });
            localStorage.setItem('questions', JSON.stringify(questions));

            fetch('http://localhost:8000/submit-question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, age, email, question })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Răspunsul rețelei nu a fost ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('message').innerText = 'Întrebare trimisă cu succes!';
                document.getElementById('error-message').innerText = '';
            })
            .catch(error => {
                document.getElementById('error-message').innerText = 'Eroare la trimiterea întrebării: ' + error.message;
                console.error('A apărut o problemă cu operația de preluare: ', error);
            });
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('sessionId', data.sessionId);
                    document.getElementById('login-message').innerText = 'Autentificare reusita!';
                } else {
                    document.getElementById('login-message').innerText = 'Autentificare eșuată: ' + data.message;
                }
            })
            .catch(error => {
                document.getElementById('login-message').innerText = 'Eroare: ' + error.message;
            });
        });
    }
});
