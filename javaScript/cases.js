// casesite/cases.js

// Дані про всі доступні кейси
const ALL_CASES_DATA = [];

// Приклади назв кейсів та шляхів до їхніх зображень
// ВАЖЛИВО: Замініть "URL_АБО_ШЛЯХ_ДО_ЗОБРАЖЕННЯ/..." на реальні шляхи або URL-адреси.
// Я використовую тут описові назви файлів як плейсхолдери.
const caseImagePlaceholders = {
    1: "https://storage.googleapis.com/drop-skin/JACKPOT-c.webp", // Приклад локального шляху
    2: "https://storage.googleapis.com/drop-skin/LEGENDARY-c.webp",
    3: "https://storage.googleapis.com/drop-skin/MAGIC-c.webp",
    4: "https://storage.googleapis.com/drop-skin/POSEIDON-c.webp",
    5: "https://storage.googleapis.com/drop-skin/MEGAKNIGHT-с.webp",
    6: "https://storage.googleapis.com/drop-skin/THOR-c.webp",
    7: "https://storage.googleapis.com/drop-skin/STARLIGHT-c.webp",
    8: "https://storage.googleapis.com/drop-skin/MONSTER-c.webp",
    9: "https://storage.googleapis.com/drop-skin/KATANA-c.webp",
    10: "https://storage.googleapis.com/drop-skin/NIGHTMARE-c.webp",
    11: "/images/0.png",
    12: "/images/1.png",
    13: "/images/2.png",
    14: "/images/3.png",
    15: "/images/5.png",
    16: "https://images.steamcdn.io/topskin/cases/ts_buddha.png",
    17: "https://images.steamcdn.io/topskin/cases/ts_jesus.png",
    18: "https://images.steamcdn.io/topskin/cases/ts_odin.png",
    19: "https://images.steamcdn.io/topskin/cases/ts_ra.png",
    20: "https://images.steamcdn.io/topskin/cases/ts_zeus.png",
    
};

const caseNameExamples = {
    1: "Кейс 'Jackpot'",
    2: "Кейс 'Фенікс'",
    3: "Кейс 'Мисливець'",
    4: "Chroma Кейс",
    5: "Chroma 2 Кейс",
    6: "Chroma 3 Кейс",
    7: "Гамма-кейс",
    8: "Гамма 2 Кейс",
    9: "Кейс 'Спектр'",
    10: "Кейс 'Спектр 2'",
    11: "Кейс 'Переломний Момент'",
    12: "Кейс 'Горизонт'",
    13: "Кейс 'Заборонена Зона'",
    14: "Кейс 'Призма'",
    15: "Кейс 'Призма 2'",
    16: "Ювілейний кейс CS20",
    17: "Кейс 'Розколота Мережа'",
    18: "Кейс 'Перелом'",
    19: "Кейс 'Укус Змії'",
    20: "Кейс 'Мрії та Жахи'",
};


for (let i = 1; i <= 20; i++) {
  let caseName = caseNameExamples[i] || `Ексклюзивний Кейс #${i}`; 
  let casePrice = parseFloat((Math.random() * 12 + 0.5).toFixed(2)); // Ціна від 0.50 до 12.50
  let caseImage = caseImagePlaceholders[i] || `https://picsum.photos/200/280?random=default_case_${i}`; // Запасне зображення, якщо немає в плейсхолдерах
  
  // Приклади коригування цін для специфічних кейсів (можете налаштувати)
  if (i === 1) casePrice = 2.75;
  if (i === 3) casePrice = 8.50; 
  if (i === 17) casePrice = 0.70; 
  if (i === 20) casePrice = 1.10;

  let caseItems = [];
  // ВАМ ПОТРІБНО ЗАМІНИТИ ЦІ ШАБЛОННІ ПРЕДМЕТИ НА РЕАЛЬНІ ДЛЯ КОЖНОГО КЕЙСУ
  const numItemsInCase = Math.floor(Math.random() * 4) + 5; // Від 5 до 8 предметів
  for (let j = 1; j <= numItemsInCase; j++) {
    let itemRarityType = j < numItemsInCase * 0.6 ? "Звичайний" : (j < numItemsInCase * 0.9 ? "Рідкісний" : "Дуже Рідкісний");
    let itemName = `${itemRarityType} Предмет ${String.fromCharCode(64 + j)}${i}`;
    let itemPrice = parseFloat((Math.random() * (casePrice * (5 + j*1.5)) + casePrice * 0.2).toFixed(2));
    let itemChance = Math.max(0.1, (100 / numItemsInCase - Math.random() * (80 / numItemsInCase))); // Базовий шанс

    if (itemRarityType === "Дуже Рідкісний") {
        itemName = `Ніж 'Еліта' Тип-${i}`;
        itemPrice = parseFloat((Math.random() * 250 + 70).toFixed(2));
        itemChance = Math.max(0.1, Math.min(1.5, itemChance / 6)); // Значно менший шанс для "ножа"
    } else if (itemRarityType === "Рідкісний") {
        itemChance = Math.max(0.1, itemChance / 2.5);
    }


    caseItems.push({
      name: itemName,
      price: itemPrice,
      chance: parseFloat(itemChance.toFixed(1)),
      image: `https://picsum.photos/150/150?random=item_placeholder_${i}_${j}` // ЗАМІНІТЬ НА РЕАЛЬНІ ЗОБРАЖЕННЯ ПРЕДМЕТІВ
    });
  }

  // Нормалізація шансів, щоб сума була приблизно 100%
  let currentTotalChance = caseItems.reduce((sum, item) => sum + item.chance, 0);
  if (currentTotalChance > 0 && caseItems.length > 0) {
      const scaleFactor = 100 / currentTotalChance;
      let normalizedSum = 0;
      // Нормалізуємо всі, крім останнього
      for(let k=0; k < caseItems.length -1; k++) {
          caseItems[k].chance = parseFloat(Math.max(0.1, (caseItems[k].chance * scaleFactor)).toFixed(1));
          normalizedSum += caseItems[k].chance;
      }
      // Останній предмет отримує залишок до 100%
      caseItems[caseItems.length -1].chance = parseFloat(Math.max(0.1, (100 - normalizedSum)).toFixed(1));

      // Додаткова перевірка, якщо сума все ще не 100 через округлення
      currentTotalChance = caseItems.reduce((sum, item) => sum + item.chance, 0);
      if (Math.abs(100 - currentTotalChance) > 0.1 * caseItems.length && caseItems.length > 0) { // Допускаємо невелику похибку
          // Проста корекція на останньому елементі
          caseItems[caseItems.length-1].chance += (100 - currentTotalChance);
          caseItems[caseItems.length-1].chance = parseFloat(Math.max(0.1, caseItems[caseItems.length-1].chance).toFixed(1));
      }

  } else if (caseItems.length > 0) { // Якщо всі початкові шанси були 0
      const equalChance = parseFloat((100 / caseItems.length).toFixed(1));
      let sumAssigned = 0;
      for(let k=0; k < caseItems.length -1; k++) {
          caseItems[k].chance = equalChance;
          sumAssigned += equalChance;
      }
      caseItems[caseItems.length -1].chance = parseFloat((100 - sumAssigned).toFixed(1));
  }


  ALL_CASES_DATA.push({
    id: i,
    name: caseName,
    price: casePrice,
    image: caseImage,
    items: caseItems
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("casesContainer");

  if (container) { 
    ALL_CASES_DATA.forEach(caseData => {
      const caseElementWrapper = document.createElement("div"); 
      caseElementWrapper.className = "case-wrapper";

      const link = document.createElement("a");
      link.href = `case.html?id=${caseData.id}`;
      link.className = "case-item-link"; 
      link.title = `Відкрити ${caseData.name}`;

      const img = document.createElement("img");
      img.src = caseData.image; 
      img.alt = caseData.name;
      // Обробник помилки завантаження зображення для обкладинки кейсу
      img.onerror = function() { 
          this.onerror=null; // Запобігаємо нескінченному циклу, якщо і запасне зображення недоступне
          this.src='https://via.placeholder.com/200x280?text=Image+Not+Available'; // Запасне зображення
          this.alt = `${caseData.name} - зображення недоступне`;
      };

      const nameSpan = document.createElement("span");
      nameSpan.className = "case-name";
      nameSpan.textContent = caseData.name; 

      link.appendChild(img);
      link.appendChild(nameSpan);
      
      const priceButton = document.createElement("button");
      priceButton.className = "case-price-button";
      priceButton.textContent = `$${caseData.price.toFixed(2)}`;
      priceButton.onclick = function(event) {
          event.preventDefault(); 
          window.location.href = `case.html?id=${caseData.id}`; 
      };

      caseElementWrapper.appendChild(link);
      caseElementWrapper.appendChild(priceButton);
      container.appendChild(caseElementWrapper);
    });
  }
});

function getCaseDataById(id) {
  return ALL_CASES_DATA.find(caseInfo => caseInfo.id === parseInt(id));
}