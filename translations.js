// IM ADDING SINGN IN LOGIC HERE CUZ THIS IS CONNECTED TO ALL HTMLS
const token = sessionStorage.getItem("token");
const logOut = document.getElementById("logOut");

if (logOut) {
  logOut.addEventListener("click", function () {
    const mockUserId = sessionStorage.getItem("mockUserId");
    const isAdmin = sessionStorage.getItem("isAdmin") === "true";

    if (!isAdmin) {
      fetch("https://68137244129f6313e2114929.mockapi.io/adminNotifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `User ID:${mockUserId} just signed out!`,
          type: "signOut",
          timestamp: new Date().toISOString(),
        }),
      });
    }

    setTimeout(() => {
      sessionStorage.clear();
      window.location.href = "signin.html";
    }, 1000);
  });
}

const isSignInPage = window.location.href.includes("signin");
const isAdmin = sessionStorage.getItem("isAdmin") === "true";

if (!isSignInPage && !isAdmin && !token) {
  window.location.href = "signin.html";
}

if (!isAdmin && token) {
  fetch("https://api.everrest.educata.dev/auth", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Not authenticated");
      }
      return res.json();
    })
    .then((user) => {
      console.log("Current user:", user);
    })
    .catch((err) => {
      console.error(err);
      sessionStorage.removeItem("token");
      window.location.href = "signin.html";
    });
}

const userPfpIcon = document.getElementById("userProfileIcon");

if (sessionStorage.getItem("isAdmin") === "true") {
  document.getElementById("userProfileHref").href = "admin.html";
  userPfpIcon.src = "Images/admin pfp.jpg";

  document.getElementById("pfpInfo").setAttribute("data-translate", "ადმინი");

  document.getElementById("pfpInfo").innerHTML = "ადმინი";
}

if (sessionStorage.getItem("isAdmin") === "false") {
  fetch("https://api.everrest.educata.dev/auth", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((user) => {
      userPfpIcon.src = user.avatar;
    });
}

let burgerBtn = document.querySelector(".burger-btn");

burgerBtn.addEventListener("click", function () {
  document.querySelector(".burger-menu-list").classList.add("active");
});

let closeBtn = document.querySelector(".closeBtn");

closeBtn.addEventListener("click", function () {
  document.querySelector(".burger-menu-list").classList.remove("active");
});

const darkTheme = document.querySelector(".dark-btn");
const body = document.querySelector("body");

darkTheme.addEventListener("click", function () {
  body.classList.toggle("dark-theme");

  if (body.classList.contains("dark-theme")) {
    sessionStorage.setItem("theme", "dark");
  } else {
    sessionStorage.setItem("theme", "light");
  }
});

window.addEventListener("DOMContentLoaded", function () {
  const savedTheme = this.sessionStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
  }
});

const translations = {
  იმეილი: {
    en: "Email",
  },

  პროფილი: {
    en: "Profile",
  },

  ადმინი: {
    en: "Admin",
  },

  "იმეილი:": {
    en: "Email:",
  },

  ნომერი: {
    en: "Number",
  },

  გადახდა: {
    en: "Pay",
  },

  საიდან: {
    en: "From",
  },

  სად: {
    en: "Where",
  },

  მგზავრები: {
    en: "Passengers",
  },

  დახმარება: {
    en: "Support",
  },

  თბილისი: {
    en: "Tbilisi",
  },

  "ბილეთების ისტორია": {
    en: "Ticket History",
  },

  ბოტი: {
    en: "ChatBot",
  },

  "ღამის რეჟიმი": {
    en: "Dark Theme",
  },

  გამოსვლა: {
    en: "Log Out",
  },

  ბათუმი: {
    en: "Batumi",
  },

  ფოთი: {
    en: "Poti",
  },

  დაჯავშნა: {
    en: "Book",
  },

  გამგზავრება: {
    en: "Departure",
  },

  ჩასვლა: {
    en: "Arrive",
  },

  მგზავრი: {
    en: "Passenger",
  },

  "ადგილი:": {
    en: "Seat:",
  },
  სახელი: {
    en: "Name",
  },

  "დაბრუნდი უკან": {
    en: "Go Back",
  },

  ბინგო: {
    en: "Train Bingo",
  },

  შეცვლა:{
    en:"Change"
  },



  "პროფილის ინფორმაცია":{
    en:"Profile Information"
  },

  "გინდა პროფილის შეცვლა? დააჭირე":{
    en:"Want To Change Profile Picture? Click This"
  },

  "დააგენერირე ფოტოები":{
    en:"Regenerate Photos"
  },

  მიმოხილვები: {
    en: "Reviews",
  },

  "გვარი:": {
    en: "Surname:",
  },

  გვარი:{
    en:"Surname"
  },

  ინვოისი: {
    en: "Invoice",
  },

  ფასი: {
    en: "Price",
  },

  ადგილი: {
    en: "Seat",
  },

  სულ: {
    en: "Sum:",
  },

  ბიზნესი: {
    en: "Bussines",
  },

  გასვლა: {
    en: "Departure",
  },

  "გასვლის თარიღი:": {
    en: "Departure date",
  },

  დაჯავშნილია: {
    en: "Booked",
  },

  "სულ გადახდილი:": {
    en: "Total Paid",
  },

  "ინვოისი იქმნება კომპიუტერის მიერ და ვალიდურია ბეჭედის და ხელმოწერის გარეშე":
    {
      en: "Invoice is generated by a computer and is valid without signature or seal",
    },

  "გადმოწერეთ ბილეთი ან შეინახეთ ბილეთის ნომერი ადგილზე წარსადგენად.": {
    en: "Downlaod the ticket or save the number to present at the location.",
  },

  "ბილეთის შემოწმება/დაბრუნება": {
    en: "Check Tickets/Refund",
  },

  "შეიძინეთ მატარებლის ბილეთები ონლაინ": {
    en: "Buy train tickets online",
  },

  "გისურვებთ ბედნიერ მგზავრობას": {
    en: "We wish you a happy journey",
    ru: "",
  },

  "დაჯავშნეთ მატარებლის ბილეთი": {
    en: "Book train ticket",
  },

  "მგზავრების რაოდენობა": {
    en: "Passenger quantity",
  },

  "გამგზავრების თარიღი": {
    en: "Departure date",
  },

  "მატარებლის მოძებნა": {
    en: "Search train",
  },
  "მატარებლის ბილეთები": {
    en: "Train tickets",
  },
  "რკინიგზის ბილეთების შესაძენად თქვენ დაგჭირდებათ თითოეული მგზავრის პირადი ნომერი. გთხოვთ მოამზადოთ ეს ინფორმაცია წინასწარ.":
    {
      en: "To buy railway tickets you will need private numbers of each passenger. Please have this information with you.",
    },
  "შეუზღუდავი შეთავაზებები": {
    en: "Unlimited offers",
  },

  "24X7 მხარდაჭერა": {
    en: "24X7 Support",
  },

  "100% უსაფრთხო": {
    en: "100% safe",
  },

  "100% უსაფრთხო გადახდა": {
    en: "100% safe payment",
  },

  "ყველა უფლება დაცულია.": {
    en: "All rights reserved.",
  },

  "თბილისი-ბათუმი": {
    en: "Tbilisi-Batumi Express",
  },
  "ბათუმი-თბილისი": {
    en: "Batumi-Tbilisi Express",
  },
  "თბილისი-ფოთი": {
    en: "Tbilisi-Poti Express",
  },

  "ფოთი-თბილისი": {
    en: "Poti-Tbilisi Express",
  },

  "აირჩიეთ თვქენთვის სასურველი მატარებელი": {
    en: "Choose the train that suits your needs",
  },
  "მატარებლების ჩამონათვალი": {
    en: "Trains List",
  },
  "მატარებლის სახელი": {
    en: "Train Name",
  },

  "პირადი ნომერი:": {
    en: "Private Number:",
  },

  "პირადი ნომერი": {
    en: "Private Number",
  },

  "ადგილის არჩევა": {
    en: "Choose Seat",
  },

  "*მოხდა შეცდომა. ყველა ველი აუცილებლად უნდა შეივსოს": {
    en: "An error occured. Every input is required",
  },

  "მგზავრების მონაცემები": {
    en: "Passengers data",
  },

  "შეიყვანეთ თქვენი მონაცემები": {
    en: "Provide your data",
  },

  "საკონტაქტო ინფორმაცია": {
    en: "Contact Info",
  },

  "მგზავრების ინფორმაცია": {
    en: "Passengers information",
  },

  "წავიკითხე და ვეთანხმები წესებს": {
    en: "I read and agreed to the rules",
  },

  "ბილეთების რეგისტრაცია": {
    en: "Registrate Tickets",
  },

  "1 კლასი": {
    en: "I Class",
  },

  "2 კლასი": {
    en: "II Class",
  },

  "გთხოვთ აირჩიოთ ვაგონი": {
    en: "Please Select a vagon",
  },

  "ვაგონის ნომერი: 1": {
    en: "Vagon Number 1",
  },

  "ვაგონის ნომერი: 2": {
    en: "Vagon Number 2",
  },

  "ვაგონის ნომერი: 3": {
    en: "Vagon Number 3",
  },
  "ტელეფონის ნომერი": {
    en: "Phone Number",
  },
  "ბარათის მფლობელი*": {
    en: "Card Owner*",
  },
  "მოქმედების ვადა*": {
    en: "Valid Until*",
  },
  "ბარათის ნომერი*": {
    en: "Card Number*",
  },
  "სულ გადასახდელი:": {
    en: "Total Must Pay",
  },
  "გადახდის გვერდი": {
    en: "Payment Page",
  },
  "ბილეთის ნომერი:": {
    en: "Ticket Number:",
  },
  "გაცემის თარიღი:": {
    en: "Date given:",
  },
  "ვაგონის N:": {
    en: "Vagon N:",
  },
  "ბილეთი წარმატებით წაიშალა!": {
    en: "Ticket deleted successfully",
  },
  "ბილეთი ვერ წაიშალა!": {
    en: "Couldn't delete ticket!",
  },

  "ბილეთის გაუქმება": {
    en: "Cancel Ticket",
  },

  "ასეთი ბილეთი არ მოიძებნა, შეამოწმეთ ბილეთის ნომერი": {
    en: "Couldn't find the ticket, check the ticket number",
  },

  "ბილეთის საფასური გადახდილია, იხილეთ ბილეთი:": {
    en: "Ticket price is paid, see the ticket:",
  },

  შემოწმება: {
    en: "Check",
  },

  "ბილეთის ნომერი": {
    en: "Ticket Number",
  },

  კვირა: {
    en: "Sunday",
  },
  ორშაბათი: {
    en: "Monday",
  },
  სამშაბათი: {
    en: "Tuesday",
  },
  ოთხშაბათი: {
    en: "Wednesday",
  },
  ასაკი:{
    en:"Age"
  },
  ხუთშაბათი: {
    en: "Thursday",
  },
  შეინახე:{
    en:"Save"
  },

  "შეცვალე პაროლი":{
    en:"Change Password"
  },

  "ძველი პაროლი":{
    en:"Old Password"
  },

  "ახალი პაროლი":{
    en:"New Password"
  },

  "შეცვალე პაროლი":{
    en:"Update Password"
  },

  პარასკევი: {
    en: "Friday",
  },
  შაბათი: {
    en: "Saturday",
  },
  იანვარი: {
    en: "January",
  },
  თებერვალი: {
    en: "February",
  },
  მარტი: {
    en: "March",
  },
  აპრილი: {
    en: "April",
  },
  მაისი: {
    en: "May",
  },
  ივნისი: {
    en: "June",
  },
  ივლისი: {
    en: "July",
  },
  აგვისტო: {
    en: "August",
  },
  სექტემბერი: {
    en: "September",
  },
  ოქტომბერი: {
    en: "October",
  },
  ნოემბერი: {
    en: "November",
  },
  დეკემბერი: {
    en: "December",
  },
  "სასურველი მატარებელი ვერ მოიძებნა": {
    en: "Couldn't find wanted train!",
  },
  "როგორ შევიძინო ბილეთი?": {
    en: "How can I buy a ticket?",
  },
  "როგორ შევამოწმო ბილეთი?": {
    en: "How can I check my ticket?",
  },
  "როგორ მოვძებნო მატარებელი?": {
    en: "How do I find a train?",
  },
  "სხვა კითხვები": {
    en: "Other questions",
  },
  "დამალე კითხვები": {
    en: "Hide questions",
  },
  "შემიძლია თუ არა ბილეთის დაბრუნება?": {
    en: "Can I return a ticket?",
  },
  "შეიძლება რამდენიმე ბილეთის ერთად შეძენა?": {
    en: "Can I buy multiple tickets together?",
  },
  "შეიძლება თუ არა ბილეთის ჩამოტვირთვა PDF ფორმატში?": {
    en: "Can I download the ticket as a PDF?",
  },
  გასუფთავება: {
    en: "Clear chat",
  },
  "კითხვის დაწერა...": {
    en: "Type your question...",
  },
  გაგზავნა: {
    en: "Send",
  },
  "ბილეთის შესაძენად მოძებნეთ მატარებელი, შეიყვანეთ მგზავრის მონაცემები და დაადასტურეთ გადახდა.":
    {
      en: "To buy a ticket, search for a train, enter passenger details, and confirm payment.",
    },
  "მთავარ გვერდზე შედით 'ბილეთის შემოწმება' სექციაში და შეიყვანეთ ბილეთის ნომერი.":
    {
      en: "Go to the 'Check Ticket' section on the homepage and enter your ticket number.",
    },
  "შეიყვანეთ გამგზავრების და დანიშნულების სადგურები და თარიღი საძიებო ფორმაში.":
    {
      en: "Enter the departure and destination stations and date in the search form.",
    },
  "დიახ, ბილეთის დაბრუნება შესაძლებელია გამოყოფილ განყოფილებაში მითითებული წესების მიხედვით.":
    {
      en: "Yes, you can return the ticket according to the rules listed in the dedicated section.",
    },
  "დიახ, შეგიძლიათ ერთდროულად რამდენიმე მგზავრისთვის შეიძინოთ ბილეთი.": {
    en: "Yes, you can purchase tickets for multiple passengers at once.",
  },
  "ბილეთის დაჯავშნის შემდეგ გექნებათ PDF ფორმატში ჩამოტვირთვის შესაძლებლობა.": {
    en: "After booking the ticket, you will be able to download it as a PDF.",
  },
};

function applyTranslations(lang) {
  document.querySelectorAll("[data-translate]").forEach((el) => {
    const key = el.getAttribute("data-translate");
    if (translations[key] && translations[key][lang]) {
      el.textContent = translations[key][lang];
    } else {
      el.textContent = key;
    }
  });
  document.querySelectorAll("[data-translate-name]").forEach((el) => {
    const key = el.getAttribute("data-translate-name");
    if (translations[key] && translations[key][lang]) {
      el.setAttribute("name", translations[key][lang]);
    } else {
      el.setAttribute("name", key);
    }
  });

  document.querySelectorAll("[data-translate-value]").forEach((el) => {
    const key = el.getAttribute("data-translate-value");
    if (translations[key] && translations[key][lang]) {
      el.setAttribute("value", translations[key][lang]);
    } else {
      el.setAttribute("value", key);
    }
  });

  document.querySelectorAll("[data-translate-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-translate-placeholder");
    if (translations[key] && translations[key][lang]) {
      el.setAttribute("placeholder", translations[key][lang]);
    } else {
      el.setAttribute("placeholder", key);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("lang");
  if (!selector) return;

  const savedLang = sessionStorage.getItem("lang") || "en";
  selector.value = savedLang;
  applyTranslations(savedLang);

  selector.addEventListener("change", (e) => {
    const lang = e.target.value;
    sessionStorage.setItem("lang", lang);
    applyTranslations(lang);
  });
});

function debounce(func, wait) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}

const debouncedApplyTranslations = debounce(() => {
  const lang = document.getElementById("lang")?.value || "ka";
  applyTranslations(lang);
}, 100);

const observer = new MutationObserver(debouncedApplyTranslations);

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: [
    "data-translate",
    "data-translate-value",
    "data-translate-placeholder",
    "value",
    "placeholder",
    "class",
  ],
});
