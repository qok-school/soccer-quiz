// クイズ.md の内容をそのままデータ化（資料に書いてあることだけ）
const QUIZZES = [
  {
    question: "サッカーの試合は、通常1チーム何人でプレーしますか?",
    choices: { A: "11人", B: "10人", C: "12人" },
    answer: "A",
    explanation:
      "「サッカーの基本ルール」の項に「サッカーは基本的に1チーム11人で試合をします」と記載されている。",
  },
  {
    question: "延長戦になった場合、通常の合計時間は何分ですか?",
    choices: { A: "30分", B: "20分", C: "40分" },
    answer: "A",
    explanation:
      "「サッカーの基本ルール」の項に「延長戦は通常、前半15分・後半15分の合計30分です」と記載されている。",
  },
  {
    question: "ペナルティーキックの地点は、ゴールラインから何メートルの位置ですか?",
    choices: { A: "11メートル", B: "9メートル", C: "13メートル" },
    answer: "A",
    explanation:
      "「サッカーの基本ルール」の項に「ペナルティーキックの地点は、ゴールラインから11メートルの位置です」と記載されている。",
  },
  {
    question: "男子FIFAワールドカップで、最も優勝回数が多い国はどこですか?",
    choices: { A: "ブラジル", B: "アルゼンチン", C: "ドイツ" },
    answer: "A",
    explanation:
      "「FIFAワールドカップの歴史」の項に「男子FIFAワールドカップで最も優勝回数が多い国はブラジルで、通算5回優勝しています」と記載されている。",
  },
  {
    question: "2022年大会の決勝トーナメント1回戦で、日本代表と対戦した国はどこですか?",
    choices: { A: "クロアチア", B: "スペイン", C: "ドイツ" },
    answer: "A",
    explanation:
      "「日本代表とワールドカップ」の項に「2022年大会の決勝トーナメント1回戦で、日本はクロアチアと対戦しました」と記載されている。",
  },
];

// わかりやすい正解・不正解の画像（インラインSVG）
const MARK_CORRECT = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="正解">
  <circle cx="60" cy="60" r="52" fill="#e4f4ea" stroke="#2f8f5b" stroke-width="10"/>
  <circle cx="60" cy="60" r="30" fill="none" stroke="#2f8f5b" stroke-width="10"/>
</svg>`;

const MARK_WRONG = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="不正解">
  <circle cx="60" cy="60" r="52" fill="#fbe7e4" stroke="#c0392b" stroke-width="10"/>
  <line x1="40" y1="40" x2="80" y2="80" stroke="#c0392b" stroke-width="10" stroke-linecap="round"/>
  <line x1="80" y1="40" x2="40" y2="80" stroke="#c0392b" stroke-width="10" stroke-linecap="round"/>
</svg>`;

// 状態
let current = 0;
let score = 0;
let answered = false;

// 要素
const progressEl = document.getElementById("progress");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");
const markEl = document.getElementById("mark");
const judgeEl = document.getElementById("judge");
const explanationEl = document.getElementById("explanation");
const nextBtn = document.getElementById("next-btn");
const quizScreen = document.getElementById("quiz-screen");
const scoreScreen = document.getElementById("score-screen");
const scoreText = document.getElementById("score-text");
const retryBtn = document.getElementById("retry-btn");

function renderQuestion() {
  answered = false;
  const q = QUIZZES[current];

  progressEl.textContent = `${current + 1} / ${QUIZZES.length}`;
  questionEl.textContent = q.question;

  choicesEl.innerHTML = "";
  for (const key of ["A", "B", "C"]) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn";
    btn.dataset.key = key;
    btn.innerHTML = `<span class="label">${key}.</span>${q.choices[key]}`;
    btn.addEventListener("click", () => handleAnswer(key));
    choicesEl.appendChild(btn);
  }

  resultEl.hidden = true;
}

function handleAnswer(key) {
  if (answered) return;
  answered = true;

  const q = QUIZZES[current];
  const isCorrect = key === q.answer;
  if (isCorrect) score++;

  // 各ボタンの状態を更新
  const buttons = choicesEl.querySelectorAll(".choice-btn");
  buttons.forEach((btn) => {
    btn.disabled = true;
    const btnKey = btn.dataset.key;
    if (btnKey === q.answer) {
      btn.classList.add("is-correct");
    } else if (btnKey === key) {
      btn.classList.add("is-wrong");
    }
  });

  // 正解・不正解の画像と解説
  markEl.innerHTML = isCorrect ? MARK_CORRECT : MARK_WRONG;
  judgeEl.textContent = isCorrect ? "正解！" : "不正解";
  judgeEl.className = "judge " + (isCorrect ? "correct" : "wrong");

  const answerText = `正解は ${q.answer}. ${q.choices[q.answer]}`;
  explanationEl.textContent = `${answerText}\n\n${q.explanation}`;
  explanationEl.style.whiteSpace = "pre-wrap";

  nextBtn.textContent =
    current === QUIZZES.length - 1 ? "結果を見る" : "次の問題へ";
  resultEl.hidden = false;
}

function goNext() {
  if (current < QUIZZES.length - 1) {
    current++;
    renderQuestion();
  } else {
    showScore();
  }
}

function showScore() {
  quizScreen.hidden = true;
  scoreScreen.hidden = false;
  progressEl.textContent = `${QUIZZES.length} / ${QUIZZES.length}`;
  scoreText.textContent = `${QUIZZES.length}問中 ${score}問 正解！`;
}

function restart() {
  current = 0;
  score = 0;
  scoreScreen.hidden = true;
  quizScreen.hidden = false;
  renderQuestion();
}

nextBtn.addEventListener("click", goNext);
retryBtn.addEventListener("click", restart);

renderQuestion();
