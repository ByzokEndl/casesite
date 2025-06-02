// /casesite/javaScript/deposit.js

document.addEventListener('DOMContentLoaded', function() {
    // --- Таймер ---
    const timerDisplay = document.getElementById('paymentTimer');
    let timeLeft = 10 * 60 - 9; // 9 хвилин 51 секунда (як на скріншоті)

    function updateTimer() {
        if (!timerDisplay) return;

        const minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        seconds = seconds < 10 ? '0' + seconds : seconds; // Додаємо нуль попереду, якщо < 10

        timerDisplay.textContent = `00:${minutes < 10 ? '0' + minutes : minutes}:${seconds}`;

        if (timeLeft > 0) {
            timeLeft--;
        } else {
            timerDisplay.textContent = "Час вийшов!";
            // Тут можна додати логіку, що відбувається, коли час вийшов
            // наприклад, деактивувати кнопку оплати або показати повідомлення
        }
    }

    if (timerDisplay) {
        updateTimer(); // Оновити одразу при завантаженні
        setInterval(updateTimer, 1000); // Оновлювати кожну секунду
    }

    // --- Копіювання в буфер обміну ---
    // Використовуємо бібліотеку clipboard.js
    if (typeof ClipboardJS !== 'undefined') {
        const clipboard = new ClipboardJS('.copy-btn');

        clipboard.on('success', function(e) {
            console.info('Скопійовано:', e.text);
            // Можна додати візуальний відгук, наприклад, змінити іконку на "галочку" на короткий час
            const originalIcon = e.trigger.innerHTML;
            e.trigger.innerHTML = '<i class="fas fa-check" style="color: green;"></i>';
            e.clearSelection();

            setTimeout(() => {
                e.trigger.innerHTML = originalIcon;
            }, 1500);
        });

        clipboard.on('error', function(e) {
            console.error('Помилка копіювання:', e.action);
            alert('Не вдалося скопіювати. Спробуйте вручну.');
        });
    } else {
        console.warn('Бібліотека ClipboardJS не завантажена. Функція копіювання не працюватиме.');
        // Можна приховати кнопки копіювання, якщо бібліотеки немає
        document.querySelectorAll('.copy-btn').forEach(btn => btn.style.display = 'none');
    }
});