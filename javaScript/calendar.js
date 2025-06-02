// Path: /casesite/javaScript/calendar.js
document.addEventListener('DOMContentLoaded', function() {
    // The settings modal JavaScript previously here is now handled by header.js and main.js

    // Додаємо клас до body для специфічних стилів календаря, якщо потрібно
    // document.body.classList.add('calendar-page-active');

    const calendarGrid = document.getElementById('calendarGrid');
    const totalDays = 30; 
    const currentActiveDay = 2; // Example
    const completedDays = [1];   // Example

    if (calendarGrid) {
        for (let i = 1; i <= totalDays; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = i;
            dayElement.dataset.day = i;

            if (completedDays.includes(i)) {
                dayElement.classList.add('completed');
            } else if (i === currentActiveDay) {
                dayElement.classList.add('active');
            } else if (i > currentActiveDay && (!completedDays.includes(i - 1) && (i-1) !== 0 || !completedDays.includes(currentActiveDay)) ) {
                dayElement.classList.add('locked');
            }
            
            dayElement.addEventListener('click', function() {
                if (this.classList.contains('locked')) {
                    alert('Цей день заблоковано. Виконайте попередні завдання.');
                    return;
                }
                if (this.classList.contains('completed')) {
                    alert('День ' + this.dataset.day + ' вже виконано.');
                    return;
                }

                const dayNumber = parseInt(this.dataset.day);

                if (this.classList.contains('active')) {
                    alert('Ви "виконали" завдання для дня ' + dayNumber + '!');
                    this.classList.remove('active');
                    this.classList.add('completed');
                    completedDays.push(dayNumber); 

                    const nextDayNumber = dayNumber + 1;
                    const nextDayElement = calendarGrid.querySelector(`.calendar-day[data-day="${nextDayNumber}"]`);
                    
                    const currentDayBadge = document.querySelector('.current-day-badge');

                    if (nextDayElement) {
                        if(currentDayBadge) currentDayBadge.textContent = nextDayNumber + ' ДЕНЬ';
                        
                        document.querySelectorAll('.calendar-day.active').forEach(d => d.classList.remove('active'));
                        
                        if (nextDayElement.classList.contains('locked')) {
                            nextDayElement.classList.remove('locked');
                        }
                        nextDayElement.classList.add('active');
                    } else {
                        if(currentDayBadge) currentDayBadge.textContent = 'КАЛЕНДАР ЗАВЕРШЕНО';
                    }
                } else {
                    alert('Це день ' + dayNumber + '. Активуйте його, виконавши завдання поточного активного дня.');
                }
            });
            calendarGrid.appendChild(dayElement);
        }
    } else {
        console.warn("Element #calendarGrid not found for calendar initialization.");
    }

    const openRulesButton = document.querySelector('.calendar-rules-btn');
    const calendarRulesModal = document.getElementById('calendarRulesModal');
    const closeRulesModalButton = document.getElementById('closeCalendarRulesModal');

    if (openRulesButton && calendarRulesModal && closeRulesModalButton) {
        openRulesButton.addEventListener('click', () => {
            calendarRulesModal.classList.add('visible');
        });

        closeRulesModalButton.addEventListener('click', () => {
            calendarRulesModal.classList.remove('visible');
        });

        calendarRulesModal.addEventListener('click', (event) => {
            if (event.target === calendarRulesModal) { 
                calendarRulesModal.classList.remove('visible');
            }
        });
    } else {
        console.warn("Elements for calendar rules modal not found.");
    }
});