const baseTastes = [
  "Sweet", "Bitter", "Sour", "Salty", "Umami", "Savory", "Astringent", "Spicy",
  "Tangy", "Herbal", "Smoky", "Nutty", "Fruity", "Floral"
];

const flavors = [
  "Vanilla", "Lemon", "Mint", "Chocolate", "Strawberry",
  "Blueberry", "Honey", "Coconut", "Orange", "Apple",
  "Grape", "Pineapple", "Peach", "Cherry", "Pear",
  "Mango", "Watermelon", "Raspberry", "Cinnamon", "Almond",
  "Coffee", "Hazelnut", "Caramel", "Peppermint", "Rose",
  "Tomato", "Basil", "Black Pepper", "Ginger", "Garlic"
];

function seedFromDate(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateHash(text) {
  const encoder = new TextEncoder();
  return crypto.subtle.digest("SHA-256", encoder.encode(text))
    .then(buf => {
      const hashArray = Array.from(new Uint8Array(buf));
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    });
}

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const date = document.getElementById("datePicker").value;
  if (!date) {
    alert("Please select a date.");
    return;
  }

  const loadingEl = document.getElementById("loading");
  const flavorEl = document.getElementById("flavorOutput");
  const hashEl = document.getElementById("hashOutput");
  const accuracyEl = document.getElementById("accuracyOutput");

  flavorEl.textContent = "";
  hashEl.textContent = "";
  accuracyEl.textContent = "";
  loadingEl.classList.remove("hidden");

  setTimeout(() => {
    const seed = seedFromDate(date);
    const base = baseTastes[seed % baseTastes.length];
    const flav = flavors[Math.floor(seed / baseTastes.length) % flavors.length];

    const taste = `${base} ${flav}`;
    flavorEl.textContent = taste;

    const accuracy = (96 + (seed % 40) / 10).toFixed(1) + "%";
    accuracyEl.textContent = "Analysis Accuracy: " + accuracy;

    generateHash(date + taste).then(hash => {
      hashEl.textContent = "Flavor ID: " + hash.toUpperCase();
    });

    loadingEl.classList.add("hidden");
  }, 800);
});

const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playPauseAudio");
const visualizer = document.getElementById("audioVisualizer");
let stopTimer = null;

for (let i = 0; i < 20; i++) {
  const bar = document.createElement("span");
  bar.style.animationDelay = `${i * 0.05}s`;
  visualizer.appendChild(bar);
}

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸ Pause";

    clearTimeout(stopTimer);
    stopTimer = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
      playBtn.textContent = "▶ Play";
    }, 10000);
  } else {
    audio.pause();
    playBtn.textContent = "▶ Play";
    clearTimeout(stopTimer);
  }
});

audio.addEventListener("ended", () => {
  playBtn.textContent = "▶ Play";
  clearTimeout(stopTimer);
});
