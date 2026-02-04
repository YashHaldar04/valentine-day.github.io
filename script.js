const container = document.querySelector('.glass-container');
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const gifImg = document.getElementById('containerGif');
const loader = document.getElementById('pageLoader');
const mainContent = document.getElementById('mainContent');

let noAttempts = 0;
let isYesClicked = false;

const hearts = ['💖','💕','💗','💝','💟','❤️','🩷'];

const sarcasticNos = [
  'After 7 years? 😂',
  'No? Bold choice 😏',
  'Try again, Diya 😜',
  'Wrong button 🙄',
  'You sure about that? 🤨',
  'This is a trap 😈'
];

const gifs = {
  question: 'gifs/question-cat.webp',
  sad: 'gifs/sad-cat2.webp',
  angry: 'gifs/angry-cat.webp',
  happy: 'gifs/happy-cat.webp'
};

/* ===== AUDIO ===== */

const sadSound = new Audio('audios/sad-cat.mp3');
const happySound = new Audio('audios/happy-celebration.mp3');

sadSound.loop = true;
sadSound.volume = 0.8;
happySound.volume = 1;


/* ===== PRELOAD GIFS ===== */

Promise.all(
  Object.values(gifs).map(src => {
    return new Promise(res => {
      const img = new Image();
      img.src = src;
      img.onload = res;
      img.onerror = res;
    });
  })
).then(() => {
  loader.classList.add('fade-out');
  mainContent.classList.remove('hidden');
  mainContent.classList.add('fade-in');
  gifImg.src = gifs.question;
});


/* ===== GIF SWITCH (MOBILE SAFE) ===== */

function setGif(src) {
  gifImg.src = src + "?v=" + Date.now();
}


/* ===== FLOATING HEARTS ===== */

function spawnHeart() {
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
  heart.style.setProperty('--drift', (Math.random() * 2 - 1).toFixed(2));
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 8000);
}

setInterval(spawnHeart, 400);


/* ===== MOVE NO BUTTON ===== */

function moveNo() {
  const rect = container.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();

  const x = Math.random() * (rect.width - btn.width);
  const y = Math.random() * (rect.height - btn.height);

  noBtn.style.position = "absolute";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}


/* ===== NO BUTTON HANDLER ===== */

function handleNo(e) {
  e.preventDefault();
  if (isYesClicked) return;

  noAttempts++;

  // ▶️ play sad sound only once (no restarting)
  if (sadSound.paused) {
    sadSound.play();
  }

  if (noAttempts === 1) setGif(gifs.sad);
  if (noAttempts === 3) setGif(gifs.angry);

  noBtn.textContent = sarcasticNos[noAttempts % sarcasticNos.length];

  moveNo();
}

noBtn.addEventListener('mouseenter', handleNo);
noBtn.addEventListener('click', handleNo);


/* ===== YES BUTTON ===== */

yesBtn.addEventListener('click', () => {

  if (isYesClicked) return;
  isYesClicked = true;

  setGif(gifs.happy);

  // ⛔ stop sad sound
  sadSound.pause();
  sadSound.currentTime = 0;

  // 🎉 play happy sound
  happySound.currentTime = 0;
  happySound.play();

  noBtn.style.display = "none";

  yesBtn.textContent = "Yayyyayyy!! 💖";
  yesBtn.style.background = "linear-gradient(135deg,#ff6b9d,#c44569)";

  for (let i = 0; i < 35; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = '❤️';
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.animationDuration = '2.5s';
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 3000);
    }, i * 40);
  }

  if (window.confetti) {
    const end = Date.now() + 2000;

    (function frame() {
      confetti({ particleCount: 40, spread: 80, origin: { x: .2, y: .7 } });
      confetti({ particleCount: 40, spread: 80, origin: { x: .8, y: .7 } });

      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

});
