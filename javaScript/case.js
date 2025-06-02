// /casesite/javaScript/case.js
// Цей код базується на тому, що ви надали, і передбачає, що:
// 1. originalItems - це статичний масив предметів для ЦЬОГО кейсу.
// 2. Файл caseAudio.js підключений до HTML і визначає функції
//    playCaseSpinSound() та stopCaseSpinSound() глобально.

const originalItems = [ 
      { name: 'Dragon Knife', price: 250, chance: 1, image: 'https://cdn.case-battle.life/images/skin/2904/middle-5c793ef629d33.png' },
      { name: 'Tiger AK', price: 120, chance: 5, image: 'https://cdn.case-battle.life/images/skin/485/middle-5c793ba9535d5.png' },
      { name: 'Ice M4', price: 90, chance: 8, image: 'https://cdn.case-battle.life/images/skin/18880/middle-6727242690fd3.png' },
      { name: 'Black Pistol', price: 45, chance: 15, image: 'https://cdn.case-battle.life/images/skin/1309/middle-5c793d2609f93.png' },
      { name: 'Flash', price: 10, chance: 30, image: 'https://cdn.case-battle.life/images/skin/2829/middle-5c793eca13da2.png' },
      { name: 'Toxic Gun', price: 65, chance: 10, image: 'https://cdn.case-battle.life/images/skin/1826/middle-5c793d8f5307d.png' },
      { name: 'Gold Rifle', price: 200, chance: 2, image: 'https://cdn.case-battle.life/images/skin/497/middle-67dd578315850.png' },
      { name: 'Mystic Wand', price: 35, chance: 18, image: 'https://cdn.case-battle.life/images/skin/2419/middle-5c793e22c4454.png' },
      { name: 'Cyber SMG', price: 55, chance: 12, image: 'https://cdn.case-battle.life/images/skin/978/middle-5c793ca0b4028.png' },
      { name: 'Shadow Glock', price: 85, chance: 9, image: 'https://cdn.case-battle.life/images/skin/19727/middle-67f7e3fc40a23.png' },
      { name: 'Phoenix Shotgun', price: 140, chance: 3, image: 'https://cdn.case-battle.life/images/skin/18963/middle-6732569c64cec.png' },
      { name: 'Tornado Uzi', price: 70, chance: 7, image: 'https://cdn.case-battle.life/images/skin/1870/middle-5c793d9c9d048.png' },
      { name: 'Venom AR', price: 100, chance: 6, image: 'https://cdn.case-battle.life/images/skin/18963/middle-6732569c64cec.png' },
      { name: 'Aqua Sniper', price: 160, chance: 4, image: 'https://cdn.case-battle.life/images/skin/15173/middle-615427528c5a0.png' },
      { name: 'Basic Pistol', price: 5, chance: 40, image: 'https://cdn.case-battle.life/images/skin/2419/middle-5c793e22c4454.png' }
    ];

    const reelElement = document.getElementById('caseItemsReel');
    const openCaseButton = document.querySelector('.open-button');
    const viewportElement = document.querySelector('.case-viewport');
    const possibleDropsContainer = document.getElementById('possibleDrops');

    const ITEM_BASE_WIDTH = 140; 
    const ITEM_MARGIN_HORIZONTAL = 10;         
    const EFFECTIVE_ITEM_WIDTH = ITEM_BASE_WIDTH + (ITEM_MARGIN_HORIZONTAL * 2); 

    const REEL_ITEMS_COUNT_MULTIPLIER = 12; // Збільшено для 9-секундної анімації
    let isSpinningActive = false;
    let generatedReelElements = []; 

    function shuffleItemsArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function populateReelWithItems(winningItemDataForReel) {
      reelElement.innerHTML = ''; 
      reelElement.style.transition = 'none'; 
      reelElement.style.transform = 'translateX(0px)'; 
      reelElement.classList.remove('reel-has-winner'); 
      generatedReelElements = []; 

      let tempReelItems = [];
      for (let i = 0; i < REEL_ITEMS_COUNT_MULTIPLIER; i++) {
        tempReelItems.push(...shuffleItemsArray([...originalItems])); 
      }
      
      const targetStopIndex = Math.floor(tempReelItems.length * 0.8) + Math.floor(Math.random() * 5);
      // Клонуємо об'єкт переможця та додаємо мітку
      const winnerCloneInReel = winningItemDataForReel ? { ...winningItemDataForReel, _isWinnerPlaceholder: true } : null;
      
      if(winnerCloneInReel){
          tempReelItems.splice(targetStopIndex, 0, winnerCloneInReel);
      }

      tempReelItems.forEach((itemData) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'case-item';
        itemDiv.dataset.name = itemData.name;
        itemDiv.dataset.price = itemData.price;
        itemDiv.dataset.chance = itemData.chance;
        itemDiv.dataset.image = itemData.image;

        itemDiv.innerHTML = `
          <img src="${itemData.image}" alt="${itemData.name}" />
          <div class="details">
            <div class="name">${itemData.name}</div>
            <div class="price">$${itemData.price}</div>
            <div class="chance">${itemData.chance}%</div>
          </div>
        `;
        reelElement.appendChild(itemDiv);
        generatedReelElements.push(itemDiv); 
      });
      
      if (winnerCloneInReel) {
          const actualWinnerDomIndex = generatedReelElements.findIndex(el => 
              el.dataset.name === winningItemDataForReel.name && 
              tempReelItems[generatedReelElements.indexOf(el)]._isWinnerPlaceholder === true
          );
          
          if (actualWinnerDomIndex !== -1) {
            const originalWinnerDataObj = tempReelItems[actualWinnerDomIndex]; // Звертаємось до масиву даних
            if (originalWinnerDataObj && originalWinnerDataObj._isWinnerPlaceholder) {
                delete originalWinnerDataObj._isWinnerPlaceholder;
            }
            return actualWinnerDomIndex;
          }
      }
      return targetStopIndex; // Якщо переможець не був вказаний, повертаємо розрахований індекс
    }

    function determineWinningItem() {
      const totalChanceSum = originalItems.reduce((sum, item) => sum + item.chance, 0);
      let randomNumber = Math.random() * totalChanceSum;
      let cumulativeChance = 0;

      for (const item of originalItems) {
        cumulativeChance += item.chance;
        if (randomNumber <= cumulativeChance) {
          return item; 
        }
      }
      return originalItems[originalItems.length - 1]; 
    }

    function displayPossibleDrops() {
        if (!possibleDropsContainer) return;
        possibleDropsContainer.innerHTML = ''; 

        const sortedItems = [...originalItems].sort((a, b) => a.chance - b.chance || b.price - a.price);

        sortedItems.forEach(itemData => {
            const dropDiv = document.createElement('div');
            dropDiv.className = 'possible-drop-item';
            dropDiv.innerHTML = `
                <img src="${itemData.image}" alt="${itemData.name}" />
                <div class="name">${itemData.name}</div>
                <div class="price">$${itemData.price}</div>
                <div class="chance">${itemData.chance}%</div>
            `;
            possibleDropsContainer.appendChild(dropDiv);
        });
    }
     
    async function startCaseOpening() {
      if (isSpinningActive) return; 

      isSpinningActive = true;
      if(openCaseButton) openCaseButton.disabled = true;

      generatedReelElements.forEach(el => el.classList.remove('is-winner'));
      if(reelElement) reelElement.classList.remove('reel-has-winner');

      const winningItemObject = determineWinningItem();
      const winningItemDomIndex = populateReelWithItems(winningItemObject);
     
      await new Promise(resolve => setTimeout(resolve, 60)); 

      if (winningItemDomIndex < 0 || winningItemDomIndex >= generatedReelElements.length) {
          console.error("Некоректний індекс виграшного елемента:", winningItemDomIndex, "Кількість елементів:", generatedReelElements.length);
          isSpinningActive = false;
          if(openCaseButton) openCaseButton.disabled = false;
          return;
      }
      const targetHtmlElement = generatedReelElements[winningItemDomIndex]; 
      
      if (!targetHtmlElement) {
        console.error("Winning DOM element not found in the reel! Index:", winningItemDomIndex);
        isSpinningActive = false;
        if(openCaseButton) openCaseButton.disabled = false;
        return;
      }
      if (!viewportElement) {
        console.error("Viewport element not found!");
        isSpinningActive = false;
        if(openCaseButton) openCaseButton.disabled = false;
        return;
      }


      const viewportCenterX = viewportElement.offsetWidth / 2;
      const targetElementOffset = targetHtmlElement.offsetLeft;
      const targetElementWidthForCalc = EFFECTIVE_ITEM_WIDTH; 
      const randomPixelOffset = (Math.random() - 0.5) * (targetElementWidthForCalc * 0.3); 
      let finalScrollToX = viewportCenterX - targetElementOffset - (targetElementWidthForCalc / 2) + randomPixelOffset;
      
      const minScrollPosition = 0; 
      const maxScrollableWidth = reelElement.scrollWidth - viewportElement.offsetWidth;
      const maxScrollPosition = maxScrollableWidth > 0 ? -maxScrollableWidth : 0;
      finalScrollToX = Math.max(maxScrollPosition, Math.min(minScrollPosition, finalScrollToX));
      
      const animationDurationSeconds = 9; // Рівно 9 секунд
      
      // Відтворення звуку через caseAudio.js
      if (typeof playCaseSpinSound === 'function') {
          playCaseSpinSound();
      } else {
          console.warn("Функція playCaseSpinSound не визначена. Перевірте підключення caseAudio.js");
      }
      
      reelElement.style.transition = `transform ${animationDurationSeconds}s cubic-bezier(0.15, 0.7, 0.25, 1)`; 
      reelElement.style.transform = `translateX(${finalScrollToX}px)`;
     
      reelElement.addEventListener('transitionend', function handleSpinEnd() {
        reelElement.removeEventListener('transitionend', handleSpinEnd); 

        // Зупинка звуку через caseAudio.js
        if (typeof stopCaseSpinSound === 'function') {
            stopCaseSpinSound();
        } else {
            console.warn("Функція stopCaseSpinSound не визначена. Перевірте підключення caseAudio.js");
        }

        targetHtmlElement.classList.add('is-winner');
        reelElement.classList.add('reel-has-winner');
            
        isSpinningActive = false;
        if(openCaseButton) openCaseButton.disabled = false;
      }, { once: true }); 
    }

    // ВИКЛИКИ ФУНКЦІЙ ПРИ ЗАВАНТАЖЕННІ
    // Переконуємося, що ці функції викликаються після того, як DOM готовий
    // і якщо ці елементи існують на сторінці.
    // Якщо цей скрипт завантажується з defer, DOMContentLoaded може бути зайвим тут,
    // але для безпеки можна залишити або перенести виклик populate/display у initializeCasePage.
    if (reelElement && possibleDropsContainer) {
        populateReelWithItems(originalItems[Math.floor(Math.random() * originalItems.length)]);
        displayPossibleDrops(); 
    }


    // --- JS для модального вікна налаштувань ---
    // Цей код передбачає, що елементи хедера вже є в DOM на момент виконання.
    // Якщо хедер завантажується динамічно через main.js, цей код краще перенести
    // в callback функцію завантаження хедера в main.js або в окремий header.js.
    const settingsBtn = document.querySelector(".settings-btn");
    const settingsModal = document.getElementById("settings-modal");
    const closeBtn = document.getElementById("close-settings"); 
    const soundToggle = document.getElementById("sound-toggle");

    if (settingsBtn && settingsModal && closeBtn) { 
        settingsBtn.addEventListener("click", () => {
            if(settingsModal) settingsModal.classList.remove("hidden");
        });

        closeBtn.addEventListener("click", () => { 
            if(settingsModal) settingsModal.classList.add("hidden");
        });

        if(settingsModal) {
            settingsModal.addEventListener('click', (event) => {
                if (event.target === settingsModal) {
                    settingsModal.classList.add("hidden");
                }
            });
        }
    }
    
    if (soundToggle && settingsModal) { // Додано перевірку на settingsModal
        soundToggle.addEventListener("change", () => {
            // Застосовуємо тільки до аудіо в модальному вікні
            const audiosInModal = settingsModal.querySelectorAll("audio");
            audiosInModal.forEach(audio => {
                audio.muted = !soundToggle.checked;
            });
        });
        // Початковий стан звуків у модалці
        const audiosInModal = settingsModal.querySelectorAll("audio");
        audiosInModal.forEach(audio => {
           audio.muted = !soundToggle.checked;
        });
    }
    // --- Кінець JS для модального вікна ---