document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("click", () => {
    const answer = item.nextElementSibling;
    if (answer && answer.classList.contains("faq-answer")) {
      answer.classList.toggle("show");
    }
  });
});

document.querySelector(".contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  showAlert("Thanks For Reaching Out! Your Message Has Been Sent!", "green")
  e.target.reset();
});

function filterFAQs(query) {
  const items = document.querySelectorAll(".faq-item");
  const answers = document.querySelectorAll(".faq-answer");
  items.forEach((item, index) => {
    const answer = answers[index];
    const match = item.textContent.toLowerCase().includes(query.toLowerCase());
    item.style.display = match ? "block" : "none";
    if (answer) answer.style.display = match ? "block" : "none";
  });
}

function scrollToCategory(categoryId) {
  const target = document.getElementById(categoryId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
}


function showAlert(message, color) {
  const alertDiv = document.getElementById("alertDiv");
  alertDiv.innerHTML = message;
  alertDiv.style.backgroundColor = color;
  alertDiv.style.bottom = "30px";
  alertDiv.style.opacity = "1";

  setTimeout(() => {
    alertDiv.style.bottom = "-100px";
    alertDiv.style.opacity = "0";
  }, 2000);
}
