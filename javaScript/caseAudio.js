// /casesite/javaScript/caseAudio.js

let caseSpinSoundElement = null; // Ініціалізуємо як null

// Ця функція буде викликана автоматично, коли DOM буде готовий
document.addEventListener('DOMContentLoaded', function() {
    caseSpinSoundElement = document.getElementById('reelSpinSound');
    if (!caseSpinSoundElement) {
        console.warn("Елемент <audio id='reelSpinSound'> не знайдено на сторінці при завантаженні caseAudio.js.");
    } else {
        // Можна додати попереднє завантаження, якщо preload="auto" не спрацьовує надійно
        // caseSpinSoundElement.load(); 
        console.log("caseAudio.js: Аудіо елемент 'reelSpinSound' знайдено та ініціалізовано.");
    }
});

// Функція для запуску відтворення звуку прокрутки
function playCaseSpinSound() {
    if (caseSpinSoundElement && typeof caseSpinSoundElement.play === 'function') {
        caseSpinSoundElement.currentTime = 0; // Починати звук спочатку
        caseSpinSoundElement.play().catch(error => {
            console.warn("Не вдалося автоматично відтворити звук прокрутки (з caseAudio.js):", error);
        });
    } else {
        if (!caseSpinSoundElement) {
            console.warn("playCaseSpinSound: аудіо елемент 'reelSpinSound' не знайдено або не ініціалізовано.");
        } else {
            console.warn("playCaseSpinSound: аудіо елемент не підтримує метод play().");
        }
    }
}

// Функція для зупинки звуку прокрутки
function stopCaseSpinSound() {
    if (caseSpinSoundElement && typeof caseSpinSoundElement.pause === 'function') {
        caseSpinSoundElement.pause();
        caseSpinSoundElement.currentTime = 0; // Скидаємо час для наступного відтворення
    } else {
        // Попередження, якщо елемент не знайдено, не потрібне тут так сильно,
        // бо якщо його не було при play, то і при stop його не буде.
    }
}

// Якщо ви використовуєте систему модулів ES6 (що не схоже на вашу поточну структуру)
// export { playCaseSpinSound, stopCaseSpinSound };
// В іншому випадку, функції будуть доступні глобально, якщо цей файл підключений до HTML.