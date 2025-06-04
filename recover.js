const email = document.getElementById("recoverEmail");
const form = document.querySelector("form");
const button = document.querySelector(".send-email");
const cooldownText = document.getElementById("cooldownText");
const signUpStatus = document.getElementById("signUpStatus");

const cooldownSeconds = 60;
let cooldownTimer;

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const newEmail = email.value.trim();

  fetch("https://api.everrest.educata.dev/auth/recovery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: newEmail }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      signUpStatus.innerHTML = "<p>Recovery Email was sent to your mail!</p>"
      signUpStatus.style.backgroundColor ="rgba(58, 226, 58, 0.49)"
      startCooldown();
    })
    .catch((err) => {
      console.error("Recovery error:", err);
      signUpStatus.innerHTML = `<p>Couldn't send email!${err}</p>`
      signUpStatus.style.backgroundColor ="#cc4949a9"
    });
});

function startCooldown() {
  let timeLeft = cooldownSeconds;
  button.disabled = true;
  cooldownText.textContent = `Please wait ${timeLeft}s`;

  cooldownTimer = setInterval(() => {
    timeLeft--;
    cooldownText.textContent = `Please wait ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(cooldownTimer);
      button.disabled = false;
      cooldownText.textContent = "";
    }
  }, 1000);
}
