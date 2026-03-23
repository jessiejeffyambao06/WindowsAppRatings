const questions = [
  "How do you rate our service?",
  "How was the user experience?",
  "How likely are you to recommend us?",
  "How satisfied are you with our support?",
  "Overall, how happy are you with us?",
];

const questionEl = document.getElementById("question");
const emojis = Array.from(document.querySelectorAll(".emoji"));
const feedbackSection = document.getElementById("feedbackSection");
const submitBtn = document.getElementById("submitBtn");
const feedbackInput = document.getElementById("feedback");
const thankYouCard = document.getElementById("thankYouCard");
const summary = document.getElementById("summary");
const closeCard = document.getElementById("closeCard");

let currentQuestionIndex = 0;
let answers = [];

// Show first question
questionEl.textContent = questions[currentQuestionIndex];

// Click listener for emojis
emojis.forEach((e) => {
  e.addEventListener("click", () => {
    answers.push({
      question: questions[currentQuestionIndex],
      rating: e.dataset.value,
    });

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      questionEl.textContent = questions[currentQuestionIndex];
    } else {
      document.querySelector(".ratings").classList.add("hidden");
      feedbackSection.classList.remove("hidden");
    }
  });
});

// Submit feedback
submitBtn.addEventListener("click", () => {
  const feedbackData = {
    answers: answers,
    feedback: feedbackInput.value,
    timestamp: new Date().toISOString(),
  };

  window.electronAPI.saveRating(feedbackData);

  summary.innerHTML = `
        <p><strong>Responses:</strong></p>
        <ul>
            ${answers.map((a) => `<li>${a.question}: ${a.rating}</li>`).join("")}
        </ul>
        <p><strong>Feedback:</strong> ${feedbackInput.value}</p>
    `;
  feedbackSection.classList.add("hidden");
  thankYouCard.classList.remove("hidden");
});

// Close popup
closeCard.addEventListener("click", () => {
  thankYouCard.classList.add("hidden");
  feedbackInput.value = "";
  answers = [];
  currentQuestionIndex = 0;

  document.querySelector(".ratings").classList.remove("hidden");
  questionEl.textContent = questions[currentQuestionIndex];
});
