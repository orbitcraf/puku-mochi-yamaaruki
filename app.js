"use strict";

const CHARACTER_STATES = {
  puku: [
    { image: "assets/puku-1.png", alt: "元気に手を振るぷく", quote: "「いくぞー！」" },
    { image: "assets/puku-2.png", alt: "大きくジャンプするぷく", quote: "「ぴょーん！」" },
    { image: "assets/puku-3.png", alt: "虫眼鏡で何かを見つけたぷく", quote: "「みつけた！」" },
    { image: "assets/puku-4.png", alt: "おにぎりを食べるぷく", quote: "「おいしい！」" }
  ],
  mochi: [
    { image: "assets/mochi-1.png", alt: "のんびり立っているもち", quote: "「ゆっくりね」" },
    { image: "assets/mochi-2.png", alt: "ちょこんと座るもち", quote: "「ちょっと やすむ…」" },
    { image: "assets/mochi-3.png", alt: "気持ちよさそうに眠るもち", quote: "「すぅ…」" },
    { image: "assets/mochi-4.png", alt: "景色をゆっくり見るもち", quote: "「まだ のぼるの？」" }
  ]
};

const SCENES = {
  departure: { puku: "assets/puku-2.png", mochi: "assets/mochi-1.png", line: "いくぞー！", reaction: "草が さわさわ。" },
  forest: { puku: "assets/puku-3.png", mochi: "assets/mochi-4.png", line: "みつけた！", reaction: "ことりが ぴゅーん！" },
  river: { puku: "assets/puku-2.png", mochi: "assets/mochi-1.png", line: "ぴょーん！", reaction: "川が きらり。" },
  slope: { puku: "assets/puku-2.png", mochi: "assets/mochi-1.png", line: "あと すこし！", reaction: "ころころ ころん。" },
  rest: { puku: "assets/puku-1.png", mochi: "assets/mochi-3.png", line: "まってるよ", reaction: "いい かぜ〜。" },
  summit: { puku: "assets/puku-2.png", mochi: "assets/mochi-1.png", line: "やったー！", reaction: "やっほー！" },
  sunset: { puku: "assets/puku-1.png", mochi: "assets/mochi-4.png", line: "また こよう", reaction: "空が きらり。" }
};

const MOUNTAIN_MESSAGES = [
  "今日は ゆっくり いこう",
  "おにぎりを わすれずに！",
  "いい石を見つけたら ちょっと休憩",
  "山頂まで あとすこし",
  "小さな音にも 耳をすませてみよう",
  "だれかと歩けば いつもの道も冒険",
  "あせらなくても 山はにげないよ",
  "今日は ぷくの歩幅、明日は もちの歩幅"
];

const ALBUM_ITEMS = [
  { image: "assets/story-2.jpg", alt: "森を歩くぷくともち", title: "森の におい", description: "葉っぱのすきまから、まるい光がたくさん落ちてきました。" },
  { image: "assets/story-3.jpg", alt: "川を渡るぷくともち", title: "川は きらきら", description: "ぷくは三歩で、もちは七歩で。冷たい水を渡りました。" },
  { image: "assets/story-5.jpg", alt: "休憩するぷくともち", title: "ひとやすみ", description: "急がない時間も、山あるきの大切な思い出です。" },
  { image: "assets/story-6.jpg", alt: "おにぎりを食べるぷくともち", title: "いちばんの ごちそう", description: "たくさん歩いたあとのおにぎりは、いつもより大きな味。" },
  { image: "assets/story-7.jpg", alt: "山頂で喜ぶぷくともち", title: "てっぺん！", description: "違う歩き方でも、ふたりで同じ景色に会えました。" },
  { image: "assets/story-8.jpg", alt: "夕焼けを見るぷくともち", title: "ふたりの ゆうやけ", description: "しずかな空を、ことばにしないで眺めました。" }
];

document.querySelectorAll("[data-character]").forEach((card) => {
  const name = card.dataset.character;
  const states = CHARACTER_STATES[name];
  let stateIndex = 0;
  const image = card.querySelector("[data-character-image]");
  const quote = card.querySelector("[data-character-quote]");
  const speech = card.querySelector("[data-character-speech]");
  let changeTimer;

  card.addEventListener("click", () => {
    stateIndex = (stateIndex + 1) % states.length;
    const state = states[stateIndex];
    window.clearTimeout(changeTimer);
    card.classList.remove("is-changing", "is-sleeping");
    speech.classList.remove("is-speaking");
    void card.offsetWidth;
    if (name === "puku") card.classList.add("is-changing");
    if (name === "mochi" && stateIndex === 2) card.classList.add("is-sleeping");
    image.style.opacity = "0";
    changeTimer = window.setTimeout(() => {
      image.src = state.image;
      image.alt = state.alt;
      quote.textContent = state.quote;
      speech.textContent = state.quote.replace(/[「」]/g, "");
      image.style.opacity = "1";
      speech.classList.add("is-speaking");
      if (name === "puku") window.bookSound?.chirp();
    }, name === "puku" ? 70 : 330);
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: 0.16, rootMargin: "0px 0px -6%" });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const story = document.querySelector(".story");
const companions = document.querySelector(".story-companions");
const trailPuku = companions?.querySelector(".trail-puku");
const trailMochi = companions?.querySelector(".trail-mochi");
const trailSpeech = companions?.querySelector(".trail-speech");
let sceneSpeechTimer;
let ticking = false;
function updateStoryProgress() {
  if (!story) return;
  const rect = story.getBoundingClientRect();
  const scrollable = Math.max(1, rect.height - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
  story.style.setProperty("--scroll-progress", progress.toFixed(3));
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateStoryProgress);
    ticking = true;
  }
}, { passive: true });
updateStoryProgress();

function activateScene(sceneName) {
  const scene = SCENES[sceneName];
  if (!scene || story?.dataset.activeScene === sceneName) return;
  story.dataset.activeScene = sceneName;
  trailPuku.src = scene.puku;
  trailMochi.src = scene.mochi;
  trailSpeech.textContent = scene.line;
  companions.classList.toggle("is-resting", sceneName === "rest" || sceneName === "sunset");
  companions.classList.remove("is-speaking");
  void companions.offsetWidth;
  companions.classList.add("is-speaking");
  window.clearTimeout(sceneSpeechTimer);
  sceneSpeechTimer = window.setTimeout(() => companions.classList.remove("is-speaking"), 1800);
  window.bookSound?.setScene(sceneName);
}

const sceneObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
  if (visible[0]) activateScene(visible[0].target.dataset.scene);
}, { threshold: [0.25, 0.5, 0.7], rootMargin: "-28% 0px -38%" });
document.querySelectorAll("[data-scene]").forEach((scene) => sceneObserver.observe(scene));

const EFFECTS = {
  grass: ["〽", "❋", "〽"], bird: ["⌁", "♪", "⌁"], river: ["○", "◌", "✦"],
  pebble: ["●", "•", "·"], wind: ["〜", "﹏", "〜"], cheer: ["!", "★", "!"], sunset: ["♥", "✦", "·"]
};
const reactionOutput = document.getElementById("scene-reaction");
document.querySelectorAll(".scene-touch").forEach((button) => {
  button.addEventListener("click", () => {
    const effect = button.dataset.effect;
    const sceneImage = button.closest(".scene-image");
    const symbols = EFFECTS[effect];
    for (let index = 0; index < 7; index += 1) {
      const particle = document.createElement("span");
      particle.className = "effect-particle";
      particle.textContent = symbols[index % symbols.length];
      particle.style.setProperty("--x", `${18 + Math.random() * 64}%`);
      particle.style.setProperty("--y", `${48 + Math.random() * 34}%`);
      particle.style.setProperty("--size", `${1 + Math.random() * 1.2}rem`);
      particle.style.setProperty("--drift", `${-45 + Math.random() * 90}px`);
      particle.style.setProperty("--spin", `${-25 + Math.random() * 50}deg`);
      sceneImage.appendChild(particle);
      window.setTimeout(() => particle.remove(), 1500);
    }
    const sceneName = button.closest("[data-scene]").dataset.scene;
    reactionOutput.textContent = SCENES[sceneName].reaction;
    if (effect === "bird") window.bookSound?.chirp();
    if (effect === "river") window.bookSound?.splash();
    if (["grass", "pebble", "wind"].includes(effect)) window.bookSound?.step();
  });
});

const messageButton = document.getElementById("message-button");
const messageOutput = document.getElementById("mountain-message");
let previousMessage = -1;
messageButton.addEventListener("click", () => {
  let next;
  do next = Math.floor(Math.random() * MOUNTAIN_MESSAGES.length);
  while (next === previousMessage && MOUNTAIN_MESSAGES.length > 1);
  previousMessage = next;
  messageOutput.classList.remove("pop");
  void messageOutput.offsetWidth;
  messageOutput.textContent = `「${MOUNTAIN_MESSAGES[next]}」`;
  messageOutput.classList.add("pop");
});

const dialog = document.getElementById("album-dialog");
const dialogImage = document.getElementById("dialog-image");
const dialogTitle = document.getElementById("dialog-title");
const dialogDescription = document.getElementById("dialog-description");
const dialogCount = document.getElementById("dialog-count");
let albumTrigger = null;

document.querySelectorAll("[data-album-index]").forEach((button) => {
  button.addEventListener("click", () => {
    albumTrigger = button;
    const index = Number(button.dataset.albumIndex);
    const item = ALBUM_ITEMS[index];
    dialogImage.src = item.image;
    dialogImage.alt = item.alt;
    dialogTitle.textContent = item.title;
    dialogDescription.textContent = item.description;
    dialogCount.textContent = `${index + 1} / ${ALBUM_ITEMS.length}`;
    dialog.showModal();
  });
});

dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
});
dialog.addEventListener("close", () => albumTrigger?.focus());
