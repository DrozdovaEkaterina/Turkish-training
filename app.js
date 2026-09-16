const STORAGE_KEY = "turkish-steps-progress-v1";

const lessons = [
  {
    id: "market",
    short: "MG",
    title: "Магазин",
    subtitle: "Покупка хлеба и оплата",
    accent: "#1b8a86",
    badge: "Market",
    situation:
      "Вы заходите в небольшой магазин у дома. Нужно поздороваться, спросить цену, купить хлеб и уточнить, можно ли оплатить картой.",
    phrases: [
      { tr: "Merhaba.", ru: "Здравствуйте." },
      { tr: "Bir ekmek alabilir miyim?", ru: "Можно один хлеб?" },
      { tr: "Bu ne kadar?", ru: "Сколько это стоит?" },
      { tr: "Poşet alabilir miyim?", ru: "Можно пакет?" },
      { tr: "Kartla ödeyebilir miyim?", ru: "Можно оплатить картой?" }
    ],
    task: {
      question: "Как спросить по-турецки: «Сколько это стоит?»",
      options: [
        "Bu ne kadar?",
        "Otobüs durağı nerede?",
        "Hesabı alabilir miyim?",
        "Kedileri seviyor musunuz?"
      ],
      answer: 0,
      success: "Верно. Bu ne kadar? — короткая и очень полезная фраза для магазина.",
      retry: "Почти. Для цены нужна фраза Bu ne kadar?"
    }
  },
  {
    id: "bus",
    short: "BS",
    title: "Автобус",
    subtitle: "Остановка, маршрут и выход",
    accent: "#3f6fe5",
    badge: "Otobüs",
    situation:
      "Вы ищете остановку и хотите понять, едет ли автобус в нужный район. В конце поездки нужно сказать водителю, что вы выходите.",
    phrases: [
      { tr: "Otobüs durağı nerede?", ru: "Где автобусная остановка?" },
      { tr: "Bu otobüs Taksim'e gider mi?", ru: "Этот автобус едет до Таксима?" },
      { tr: "Bir bilet, lütfen.", ru: "Один билет, пожалуйста." },
      { tr: "Ne zaman gelir?", ru: "Когда он придёт?" },
      { tr: "İnecek var.", ru: "Есть выходящий." }
    ],
    task: {
      question: "Как сказать в автобусе: «Есть выходящий»?",
      options: [
        "Menüyü alabilir miyim?",
        "İnecek var.",
        "Bu kedi çok sevimli.",
        "Poşet alabilir miyim?"
      ],
      answer: 1,
      success: "Да. İnecek var. пригодится перед вашей остановкой.",
      retry: "Нужная фраза — İnecek var. Её говорят, когда хотят выйти."
    }
  },
  {
    id: "cats",
    short: "KT",
    title: "Разговор о кошках",
    subtitle: "Небольшой разговор с прохожим",
    accent: "#7757d9",
    badge: "Kediler",
    situation:
      "На улице вы видите красивую кошку рядом с прохожим. Хочется вежливо начать разговор, спросить, любит ли человек кошек, и узнать имя животного.",
    phrases: [
      { tr: "Kedileri seviyor musunuz?", ru: "Вы любите кошек?" },
      { tr: "Bu kedi çok sevimli.", ru: "Эта кошка очень милая." },
      { tr: "Onun adı ne?", ru: "Как её зовут?" },
      { tr: "Sokak kedisi mi?", ru: "Это уличная кошка?" },
      { tr: "Onu besleyebilir miyim?", ru: "Можно её покормить?" }
    ],
    task: {
      question: "Как спросить: «Как её зовут?»",
      options: [
        "Onun adı ne?",
        "Şekersiz olsun.",
        "Kartla ödeyebilir miyim?",
        "Bir bilet, lütfen."
      ],
      answer: 0,
      success: "Точно. Onun adı ne? — естественный вопрос про имя.",
      retry: "Для имени используйте Onun adı ne?"
    }
  },
  {
    id: "cafe",
    short: "CF",
    title: "Кафе",
    subtitle: "Заказ напитка и счёт",
    accent: "#e8664f",
    badge: "Kafe",
    situation:
      "Вы садитесь в кафе, просите меню, заказываете кофе или чай без сахара, а затем просите счёт.",
    phrases: [
      { tr: "Menüyü alabilir miyim?", ru: "Можно меню?" },
      { tr: "Bir kahve alabilir miyim?", ru: "Можно кофе?" },
      { tr: "Bir çay alabilir miyim?", ru: "Можно чай?" },
      { tr: "Şekersiz olsun.", ru: "Без сахара." },
      { tr: "Hesabı alabilir miyim?", ru: "Можно счёт?" }
    ],
    task: {
      question: "Какая фраза подойдёт, чтобы попросить счёт?",
      options: [
        "Hesabı alabilir miyim?",
        "Sokak kedisi mi?",
        "Ne zaman gelir?",
        "Bu ne kadar?"
      ],
      answer: 0,
      success: "Правильно. Hesabı alabilir miyim? — вежливый способ попросить счёт.",
      retry: "Для счёта нужна фраза Hesabı alabilir miyim?"
    }
  }
];

const lessonList = document.querySelector("[data-lesson-list]");
const lessonStage = document.querySelector("[data-lesson-stage]");
const progressCount = document.querySelector("[data-progress-count]");
const progressPercent = document.querySelector("[data-progress-percent]");
const currentTopic = document.querySelector("[data-current-topic]");
const resetButtons = document.querySelectorAll("[data-reset-progress]");
const flashcardTopic = document.querySelector("[data-flashcard-topic]");
const flashcardPhrase = document.querySelector("[data-flashcard-phrase]");
const flashcardTranslation = document.querySelector("[data-flashcard-translation]");
const showTranslationButton = document.querySelector("[data-show-translation]");
const nextCardButton = document.querySelector("[data-next-card]");

let state = loadState();
let activeLessonId = state.currentLesson || lessons[0].id;
let activeFlashcard = pickFlashcard();

render();
renderFlashcard();

resetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state = { currentLesson: lessons[0].id, completed: {}, attempts: {} };
    activeLessonId = lessons[0].id;
    saveState();
    render();
    renderFlashcard();
  });
});

showTranslationButton.addEventListener("click", () => {
  flashcardTranslation.hidden = false;
});

nextCardButton.addEventListener("click", () => {
  activeFlashcard = pickFlashcard(activeFlashcard);
  renderFlashcard();
});

function render() {
  renderLessonList();
  renderLesson(activeLessonId);
  renderProgress();
}

function renderLessonList() {
  lessonList.innerHTML = lessons
    .map((lesson, index) => {
      const isDone = Boolean(state.completed[lesson.id]);
      const isActive = lesson.id === activeLessonId;
      return `
        <button
          class="lesson-tab${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}"
          type="button"
          style="--accent: ${lesson.accent}"
          data-lesson-id="${lesson.id}"
        >
          <span class="lesson-icon">${lesson.short}</span>
          <span>
            <strong>${index + 1}. ${lesson.title}</strong>
            <span>${lesson.subtitle}</span>
          </span>
          <span class="lesson-status">${isDone ? "✓" : index + 1}</span>
        </button>
      `;
    })
    .join("");

  lessonList.querySelectorAll("[data-lesson-id]").forEach((button) => {
    button.addEventListener("click", () => {
      activeLessonId = button.dataset.lessonId;
      state.currentLesson = activeLessonId;
      saveState();
      render();
    });
  });
}

function renderLesson(lessonId) {
  const lesson = lessons.find((item) => item.id === lessonId) || lessons[0];
  const attempt = state.attempts[lesson.id];
  const isCorrect = attempt && attempt.selected === lesson.task.answer;
  const nextLesson = lessons[(lessons.findIndex((item) => item.id === lesson.id) + 1) % lessons.length];

  lessonStage.innerHTML = `
    <article style="--accent: ${lesson.accent}">
      <div class="lesson-hero">
        <div>
          <p class="eyebrow">${lesson.badge}</p>
          <h2>${lesson.title}</h2>
          <p class="metric-label">${lesson.subtitle}</p>
        </div>
        <span class="lesson-badge">${state.completed[lesson.id] ? "Пройдено" : "Мини-урок"}</span>
      </div>

      <div class="situation">
        <h3>Ситуация</h3>
        <p>${lesson.situation}</p>
      </div>

      <h3>Полезные фразы</h3>
      <div class="phrase-grid">
        ${lesson.phrases
          .map(
            (phrase) => `
              <div class="phrase-card">
                <div>
                  <strong lang="tr">${phrase.tr}</strong>
                  <span>${phrase.ru}</span>
                </div>
                <button class="listen-button" type="button" data-speak="${escapeAttribute(phrase.tr)}" aria-label="Прослушать фразу">
                  TR
                </button>
              </div>
            `
          )
          .join("")}
      </div>

      <div class="quiz">
        <h3>Задание</h3>
        <p>${lesson.task.question}</p>
        <div class="answer-grid">
          ${lesson.task.options
            .map((option, index) => {
              const selected = attempt && attempt.selected === index;
              const correctnessClass = selected ? (index === lesson.task.answer ? " is-correct" : " is-wrong") : "";
              return `
                <button
                  class="answer-button${selected ? " is-selected" : ""}${correctnessClass}"
                  type="button"
                  data-answer="${index}"
                >
                  ${option}
                </button>
              `;
            })
            .join("")}
        </div>
        <div class="feedback${attempt ? " is-visible" : ""}" data-feedback>
          ${attempt ? (isCorrect ? lesson.task.success : lesson.task.retry) : ""}
        </div>
      </div>

      <div class="lesson-actions">
        <button class="primary-button" type="button" data-next-lesson="${nextLesson.id}">
          Следующий урок
        </button>
        <button class="secondary-button" type="button" data-repeat-card="${lesson.id}">
          В повторение
        </button>
      </div>
    </article>
  `;

  lessonStage.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = Number(button.dataset.answer);
      state.attempts[lesson.id] = { selected, answeredAt: new Date().toISOString() };
      if (selected === lesson.task.answer) {
        state.completed[lesson.id] = true;
      }
      saveState();
      render();
    });
  });

  lessonStage.querySelectorAll("[data-speak]").forEach((button) => {
    button.addEventListener("click", () => speak(button.dataset.speak));
  });

  const nextButton = lessonStage.querySelector("[data-next-lesson]");
  nextButton.addEventListener("click", () => {
    activeLessonId = nextButton.dataset.nextLesson;
    state.currentLesson = activeLessonId;
    saveState();
    render();
    document.querySelector("#lessons").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const repeatButton = lessonStage.querySelector("[data-repeat-card]");
  repeatButton.addEventListener("click", () => {
    activeFlashcard = pickFlashcardFromLesson(repeatButton.dataset.repeatCard);
    renderFlashcard();
    document.querySelector("#practice").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderProgress() {
  const completed = lessons.filter((lesson) => state.completed[lesson.id]).length;
  const percent = Math.round((completed / lessons.length) * 100);
  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) || lessons[0];

  progressCount.textContent = `${completed}/${lessons.length}`;
  progressPercent.textContent = `${percent}%`;
  currentTopic.textContent = activeLesson.title;
}

function renderFlashcard() {
  const lesson = lessons.find((item) => item.id === activeFlashcard.lessonId) || lessons[0];
  flashcardTopic.textContent = lesson.title;
  flashcardPhrase.textContent = activeFlashcard.tr;
  flashcardTranslation.textContent = activeFlashcard.ru;
  flashcardTranslation.hidden = true;
}

function pickFlashcard(previous) {
  const cards = lessons.flatMap((lesson) =>
    lesson.phrases.map((phrase) => ({
      lessonId: lesson.id,
      tr: phrase.tr,
      ru: phrase.ru
    }))
  );
  if (cards.length <= 1) return cards[0];

  let card = cards[Math.floor(Math.random() * cards.length)];
  while (previous && card.tr === previous.tr) {
    card = cards[Math.floor(Math.random() * cards.length)];
  }
  return card;
}

function pickFlashcardFromLesson(lessonId) {
  const lesson = lessons.find((item) => item.id === lessonId) || lessons[0];
  const phrase = lesson.phrases[Math.floor(Math.random() * lesson.phrases.length)];
  return { lessonId: lesson.id, tr: phrase.tr, ru: phrase.ru };
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "tr-TR";
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === "object") {
      return {
        currentLesson: saved.currentLesson || lessons[0].id,
        completed: saved.completed || {},
        attempts: saved.attempts || {}
      };
    }
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
  return { currentLesson: lessons[0].id, completed: {}, attempts: {} };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeAttribute(value) {
  return String(value).replace(/"/g, "&quot;");
}
