// Код для index.html + базова авторизація та реєстрація з localStorage

document.addEventListener("DOMContentLoaded", () => {
  // Показати кейси на головній
  const container = document.getElementById("casesContainer");

  // Генеруємо 20 кейсів
  for (let i = 1; i <= 20; i++) {
    const link = document.createElement("a");
    link.href = `case.html?id=${i}`;
    link.className = "case-item";
    link.title = `Відкрити кейс #${i}`;

    const img = document.createElement("img");
    img.src = `https://picsum.photos/200?random=${i}`;
    img.alt = `Кейс №${i}`;

    const span = document.createElement("span");
    span.textContent = `Кейс #${i}`;

    link.appendChild(img);
    link.appendChild(span);
    container.appendChild(link);
  }

  // Перевірка чи користувач залогінений, показати посилання на профіль
  const profileLink = document.getElementById("profileLink");
  const user = localStorage.getItem("dinoUser");
  if (user) {
    profileLink.style.display = "inline-block";
  } else {
    profileLink.style.display = "none";
  }
});
