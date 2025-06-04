const fromInput = document.querySelector(".from"),
  fromList = document.querySelector(".from-ul"),
  fromListOption = document.querySelectorAll(".from-ul li"),
  toInput = document.querySelector(".to"),
  toList = document.querySelector(".to-ul"),
  toListOption = document.querySelectorAll(".to-ul li"),
  dateInput = document.querySelector(".date"),
  passengerCount = document.querySelector(".count"),
  searchTrainBtn = document.querySelector(".search-train"),
  listOption = document.querySelectorAll("form ul li"),
  header = document.getElementById("header"),
  myForm = document.getElementById("myForm");

fromInput.setAttribute("readonly", true);
toInput.setAttribute("readonly", true);

document.addEventListener("DOMContentLoaded", function () {
  flatpickr("#dateInput", {
    dateFormat: "Y-m-d",
    allowInput: false,
    clickOpens: true,
    minDate: "today",
  });
});

// Show dropdown
fromInput.addEventListener("click", () => {
  fromInput.classList.add("active");
  document.querySelector(".input-from").classList.add("active");
});

// Hide dropdown
window.addEventListener("click", function (event) {
  if (event.target !== fromInput) {
    fromInput.classList.remove("active");
    document.querySelector(".input-from").classList.remove("active");
  }
});

// Handle "From" option click
fromListOption.forEach((option) => {
  option.addEventListener("click", function () {
    fromInput.value = this.textContent;
    fromInput.setAttribute(
      "data-value",
      this.getAttribute("data-value") || this.textContent
    ); 
    fromInput.classList.remove("active");
  });
});

// Show dropdown
toInput.addEventListener("click", () => {
  toInput.classList.add("active");
  document.querySelector(".input-to").classList.add("active");
});

// Hide dropdown
window.addEventListener("click", function (event) {
  if (event.target !== toInput) {
    toInput.classList.remove("active");
    document.querySelector(".input-to").classList.remove("active");
  }
});

// Handle "To" option click
toListOption.forEach((option) => {
  option.addEventListener("click", function () {
    toInput.value = this.textContent;
    toInput.setAttribute(
      "data-value",
      this.getAttribute("data-value") || this.textContent
    ); 
    toInput.classList.remove("active");
  });
});

// Form submit logic
myForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (
    fromInput.value.trim() === "საიდან" ||
    toInput.value.trim() === "სად" ||
    fromInput.value.trim() === "From" ||
    toInput.value.trim() === "Where" ||
    dateInput.value.trim() === "" ||
    passengerCount.value.trim() === "" ||
    fromInput.value.trim() === toInput.value.trim()
  ) {
    alert("ყველა ველი სწორად შეავსეთ!");
    return;
  } else {
    const selectedDate = dateInput.value;

    const georgianWeekDays = [
      "კვირა",
      "ორშაბათი",
      "სამშაბათი",
      "ოთხშაბათი",
      "ხუთშაბათი",
      "პარასკევი",
      "შაბათი",
    ];

    const georgianMonths = [
      "იანვარი",
      "თებერვალი",
      "მარტი",
      "აპრილი",
      "მაისი",
      "ივნისი",
      "ივლისი",
      "აგვისტო",
      "სექტემბერი",
      "ოქტომბერი",
      "ნოემბერი",
      "დეკემბერი",
    ];

    const date = new Date(selectedDate);
    const weekDayName = georgianWeekDays[date.getDay()];
    const dayNumber = date.getDate();
    const monthName = georgianMonths[date.getMonth()];

    sessionStorage.setItem("georgianWeekDay", weekDayName);
    sessionStorage.setItem("georgianDayNumber", dayNumber);
    sessionStorage.setItem("georgianMonthName", monthName);

    sessionStorage.setItem(
      "fromInputValue",
      fromInput.getAttribute("data-value")
    );
    sessionStorage.setItem("toInputValue", toInput.getAttribute("data-value"));
    sessionStorage.setItem("passengerCount", passengerCount.value);

    window.location.href = "wantedTrains.html";
  }
});
