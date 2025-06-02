const originalItems = [ 
      { name: 'Dragon Knife', price: 250, chance: 1, image: 'https://picsum.photos/id/10/200' },
      { name: 'Tiger AK', price: 120, chance: 5, image: 'https://picsum.photos/id/20/200' },
      { name: 'Ice M4', price: 90, chance: 8, image: 'https://picsum.photos/id/30/200' },
      { name: 'Black Pistol', price: 45, chance: 15, image: 'https://picsum.photos/id/40/200' },
      { name: 'Flash', price: 10, chance: 30, image: 'https://picsum.photos/id/50/200' },
      { name: 'Toxic Gun', price: 65, chance: 10, image: 'https://picsum.photos/id/60/200' },
      { name: 'Gold Rifle', price: 200, chance: 2, image: 'https://picsum.photos/id/70/200' },
      { name: 'Mystic Wand', price: 35, chance: 18, image: 'https://picsum.photos/id/80/200' },
      { name: 'Cyber SMG', price: 55, chance: 12, image: 'https://picsum.photos/id/90/200' },
      { name: 'Shadow Glock', price: 85, chance: 9, image: 'https://picsum.photos/id/100/200' },
      { name: 'Phoenix Shotgun', price: 140, chance: 3, image: 'https://picsum.photos/id/110/200' },
      { name: 'Tornado Uzi', price: 70, chance: 7, image: 'https://picsum.photos/id/120/200' },
      { name: 'Venom AR', price: 100, chance: 6, image: 'https://picsum.photos/id/130/200' },
      { name: 'Aqua Sniper', price: 160, chance: 4, image: 'https://picsum.photos/id/140/200' },
      { name: 'Basic Pistol', price: 5, chance: 40, image: 'https://picsum.photos/id/150/200' }
    ];

    const reelElement = document.getElementById('caseItemsReel');
    const openCaseButton = document.querySelector('.open-button');
    const viewportElement = document.querySelector('.case-viewport');
    const possibleDropsContainer = document.getElementById('possibleDrops'); // Контейнер для списку можливих дропів

    const ITEM_BASE_WIDTH = 140; 
    const ITEM_MARGIN_HORIZONTAL = 10;         
    const EFFECTIVE_ITEM_WIDTH = ITEM_BASE_WIDTH + (ITEM_MARGIN_HORIZONTAL * 2); 

    const REEL_ITEMS_COUNT_MULTIPLIER = 7; 
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
      const winnerCloneInReel = { ...winningItemDataForReel, _isWinnerPlaceholder: true };
      tempReelItems.splice(targetStopIndex, 0, winnerCloneInReel); 

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
      
      const actualWinnerDomIndex = generatedReelElements.findIndex(el => el.dataset.name === winningItemDataForReel.name && tempReelItems[generatedReelElements.indexOf(el)]._isWinnerPlaceholder);
      
      if (actualWinnerDomIndex !== -1) {
        const originalWinnerDataObj = tempReelItems[actualWinnerDomIndex];
        if (originalWinnerDataObj && originalWinnerDataObj._isWinnerPlaceholder) {
            delete originalWinnerDataObj._isWinnerPlaceholder;
        }
        return actualWinnerDomIndex;
      }
      return targetStopIndex;
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
      openCaseButton.disabled = true;

      generatedReelElements.forEach(el => el.classList.remove('is-winner'));
      reelElement.classList.remove('reel-has-winner');

      const winningItemObject = determineWinningItem();
      const winningItemDomIndex = populateReelWithItems(winningItemObject);
     
      await new Promise(resolve => setTimeout(resolve, 60)); 

      const targetHtmlElement = generatedReelElements[winningItemDomIndex]; 
      if (!targetHtmlElement) {
        console.error("Winning DOM element not found in the reel!");
        isSpinningActive = false;
        openCaseButton.disabled = false;
        return;
      }

      const viewportCenterX = viewportElement.offsetWidth / 2;
      const targetElementOffset = targetHtmlElement.offsetLeft;
      const targetElementWidthForCalc = EFFECTIVE_ITEM_WIDTH; 
      const randomPixelOffset = (Math.random() - 0.5) * (targetElementWidthForCalc * 0.3); 
      let finalScrollToX = viewportCenterX - targetElementOffset - (targetElementWidthForCalc / 2) + randomPixelOffset;
      const minScrollPosition = 0; 
      const maxScrollPosition = -(reelElement.scrollWidth - viewportElement.offsetWidth);
      finalScrollToX = Math.max(maxScrollPosition, Math.min(minScrollPosition, finalScrollToX));
      const animationTimeMs = 4500 + Math.random() * 2000; 
      reelElement.style.transition = `transform ${animationTimeMs / 1000}s cubic-bezier(0.15, 0.7, 0.25, 1)`; 
      reelElement.style.transform = `translateX(${finalScrollToX}px)`;
     
      reelElement.addEventListener('transitionend', function handleSpinEnd() {
        reelElement.removeEventListener('transitionend', handleSpinEnd); 

        targetHtmlElement.classList.add('is-winner');
        reelElement.classList.add('reel-has-winner');
            
        isSpinningActive = false;
        openCaseButton.disabled = false;
      }, { once: true }); 
    }

    // ВИКЛИКИ ФУНКЦІЙ ПРИ ЗАВАНТАЖЕННІ
    populateReelWithItems(originalItems[Math.floor(Math.random() * originalItems.length)]);
    displayPossibleDrops(); 

    // --- JS для модального вікна налаштувань (ТОЧНО ЯК НА INDEX.HTML) ---
    const settingsBtn = document.querySelector(".settings-btn");
    const settingsModal = document.getElementById("settings-modal");
    const closeBtn = document.getElementById("close-settings"); 
    const soundToggle = document.getElementById("sound-toggle");

    if (settingsBtn && settingsModal && closeBtn) { 
        settingsBtn.addEventListener("click", () => {
            settingsModal.classList.remove("hidden");
        });

        closeBtn.addEventListener("click", () => { 
            settingsModal.classList.add("hidden");
        });

        settingsModal.addEventListener('click', (event) => {
            if (event.target === settingsModal) {
                settingsModal.classList.add("hidden");
            }
        });
    }
    
    if (soundToggle) {
        soundToggle.addEventListener("change", () => {
            const audios = document.querySelectorAll("audio");
            audios.forEach(audio => {
            audio.muted = !soundToggle.checked;
            });
        });
    }
    // --- Кінець JS для модального вікна ---