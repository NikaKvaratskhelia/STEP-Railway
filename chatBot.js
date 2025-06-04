const responses = {
  "როგორ შევიძინო ბილეთი?":
    "ბილეთის შესაძენად მოძებნეთ მატარებელი, შეიყვანეთ მგზავრის მონაცემები და დაადასტურეთ გადახდა.",
  "როგორ შევამოწმო ბილეთი?":
    "მთავარ გვერდზე შედით 'ბილეთის შემოწმება' სექციაში და შეიყვანეთ ბილეთის ნომერი.",
  "როგორ მოვძებნო მატარებელი?":
    "შეიყვანეთ გამგზავრების და დანიშნულების სადგურები და თარიღი საძიებო ფორმაში.",
  "შემიძლია თუ არა ბილეთის დაბრუნება?":
    "დიახ, ბილეთის დაბრუნება შესაძლებელია გამოყოფილ განყოფილებაში მითითებული წესების მიხედვით.",
  "შეიძლება რამდენიმე ბილეთის ერთად შეძენა?":
    "დიახ, შეგიძლიათ ერთდროულად რამდენიმე მგზავრისთვის შეიძინოთ ბილეთი.",
  "შეიძლება თუ არა ბილეთის ჩამოტვირთვა PDF ფორმატში?":
    "ბილეთის დაჯავშნის შემდეგ გექნებათ PDF ფორმატში ჩამოტვირთვის შესაძლებლობა.",
};

const chatBox = document.getElementById("chatBox");

function appendMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = text;
  msg.setAttribute(`data-translate`, text);
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showLoader() {
  const loader = document.createElement("div");
  loader.className = "loader";
  loader.id = "loader";
  chatBox.appendChild(loader);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.remove();
}

function sendQuestion(question) {
  appendMessage(question, "user");
  showLoader();
  setTimeout(() => {
    removeLoader();
    appendMessage(
      responses[question] ||
        "დამატებითი ინფორმაციისთვის დაუკავშირდით მხარდაჭერას.",
      "bot"
    );
  }, 1000);
}

function handleCustomInput() {
  const input = document.getElementById("userInput");
  const question = input.value.trim();
  if (question) {
    sendQuestion(question);
    input.value = "";
  }
}

function toggleExtraQuestions() {
  const extra = document.getElementById("extraQuestions");
  let btn = document.getElementById("toggleMoreBtn");
  extra.style.display = extra.style.display === "none" ? "flex" : "none";
  btn.textContent =
    extra.style.display === "none" ? "სხვა კითხვები" : "დამალე კითხვები";
    btn.setAttribute(
      "data-translate", btn.textContent
    );
}

function clearChat() {
  chatBox.innerHTML = "";
}
