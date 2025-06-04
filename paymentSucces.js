const chosenSeatIDs = JSON.parse(sessionStorage.getItem("chosenSeatIDs"));
const ticketId = sessionStorage.getItem("ticket-id");
const cardOwner = sessionStorage.getItem("cardOwner");
const cardNumber = sessionStorage.getItem("cardNum");
const passengersCount = sessionStorage.getItem("passengerCount");
const theTrain = JSON.parse(sessionStorage.getItem("theTrain"));
const passEmail = sessionStorage.getItem("passEmail");
const passPhoneNum = sessionStorage.getItem("passPhoneNum");
const ticket = JSON.parse(sessionStorage.getItem("ticket"));
console.log(ticket);
const passengersInfo = ticket.people;
const ticketinfo = document.querySelector(".ticket-info");
const total = sessionStorage.getItem("total");
const today = new Date();
const formattedDate = `${
  today.getMonth() + 1
}-${today.getDate()}-${today.getFullYear()}`;
const georgianDayNumber = sessionStorage.getItem("georgianDayNumber");
const georgianMonthName = sessionStorage.getItem("georgianMonthName");
const georgianWeekDay = sessionStorage.getItem("georgianWeekDay");

function maskCardNumberWithSpaces(cardNumber) {
  const digitsOnly = cardNumber.replace(/\s+/g, "");
  if (digitsOnly.length < 4) return cardNumber;

  const firstTwo = digitsOnly.slice(0, 2);
  const lastTwo = digitsOnly.slice(-2);
  const masked = firstTwo + "*".repeat(digitsOnly.length - 4) + lastTwo;
  const maskedWithSpaces = masked.replace(/(.{4})/g, "$1 ").trim();
  return maskedWithSpaces;
}

document.addEventListener("DOMContentLoaded", function () {
  ticketinfo.innerHTML = `
    <div class="company-name">
        <p>Step Railway</p>
        <img src="Images/stepLogo.jpg" alt="Step Logo" />
    </div>
    
    <div class="ticket-id-date">
        <p><span data-translate="ბილეთის ნომერი:">ბილეთის ნომერი:</span> ${ticketId.replace(
          "ბილეთი წარმატებით დაიჯავშნა. ბილეთის ნომერია:",
          ""
        )}</p>
    
        <p><span data-translate="გაცემის თარიღი:">გაცემის თარიღი:</span> ${formattedDate}</p>
    </div>
    
    <div class="train-info">
        <div>
            <p data-translate="გასვლა">გასვლა:</p>
            <p>${theTrain.departure}</p>
        </div>
        <div>
            <p data-translate="ჩასვლა">ჩასვლა:</p>
            <p>${theTrain.arrive}</p>
        </div>
        <div>
            <p data-translate="გასვლის თარიღი:">გასვლის თარიღი:</p>
            <p><span data-translate="${georgianWeekDay}">${georgianWeekDay} </span> ${georgianDayNumber} <span data-translate="${georgianMonthName}">${georgianMonthName}</span></p>
        </div>
    </div>
    
    <div class="contact-info">
        <p data-translate="საკონტაქტო ინფორმაცია">საკონტაქტო ინფორმაცია:</p>
        <div>
            <p><span data-translate="იმეილი:">იმეილი:</span> ${passEmail}</p>
            <p><span data-translate="ნომერი">ნომერი:</span> ${passPhoneNum}</p>
        </div>
    </div>

    <div class="passengers-div">
    <p data-translate="მგზავრები">მგზავრები</p>
        <div class='passengers-info'>
        
        </div>
    </div> 
    
    <div class="payment-info">
      <div class="card-info">
        <div>
          <p>Payment Info:</p>
          <p>${cardOwner}</p>
        </div>

        <div>
          <p>Credit Card:</p>
          <p>${maskCardNumberWithSpaces(cardNumber)}</p>
        </div>
        
      </div>

      <div class='total'>
      <p data-translate="სულ გადახდილი:">სულ გადახდილი:</p>
        <p>${total}₾</p>
      </div>
    </div>

    <div class="invoice-copyright">
      <p data-translate="ინვოისი იქმნება კომპიუტერის მიერ და ვალიდურია ბეჭედის და ხელმოწერის გარეშე">ინვოისი იქმნება კომპიუტერის მიერ და ვალიდურია ბეჭედის და ხელმოწერის გარეშე</p>
      <p data-translate="გადმოწერეთ ბილეთი ან შეინახეთ ბილეთის ნომერი ადგილზე წარსადგენად.">გადმოწერეთ ბილეთი ან შეინახეთ ბილეთის ნომერი ადგილზე წარსადგენად.<p>
    </div>
    `;

  const passengersDiv = document.querySelector(".passengers-info");

  passengersDiv.innerHTML = "";
  console.log(passengersInfo);
  passengersInfo.forEach((passenger) => {
    fetch(`https://railway.stepprojects.ge/api/seat/${passenger.seatId}`)
      .then((res) => res.json())
      .then((data) => {
        passengersDiv.innerHTML += `
          <div class="pass-container">
              <div>
                  <p data-translate="სახელი:">სახელი:</p>
                  <p>${passenger.name}</p>
              </div>
  
              <div>
                  <p data-translate="გვარი:">გვარი:</p>
                  <p>${passenger.surname}</p>
              </div>
  
              <div>
                  <p data-translate="პირადი ნომერი:">პირადი ნომერი:</p>
                  <p>${passenger.idNumber}</p>
              </div>
  
              <div>
                  <p data-translate="ადგილი:">ადგილი:</p>
                  <p>${data.number}</p>
              </div>
  
              <div>
                  <p data-translate="ვაგონის N:">ვაგონის N:</p>
                  <p>${data.vagonId}</p>
              </div>
          </div>
        `;
      });
  });
});

const printBtn = document.querySelector(".print");
const downloadBtn = document.querySelector(".download");

const ticketEl = document.querySelector(".ticket-info");

window.addEventListener("DOMContentLoaded", () => {
  const { jsPDF } = window.jspdf;

  let lastRenderedCanvas = null;

  function renderTicketAsCanvas() {
    return html2canvas(ticketEl, { scale: 2 }).then((canvas) => {
      lastRenderedCanvas = canvas;
      return canvas;
    });
  }

  downloadBtn.addEventListener("click", () => {
    renderTicketAsCanvas().then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

      const imgDisplayWidth = imgWidth * ratio;
      const imgDisplayHeight = imgHeight * ratio;

      const x = (pageWidth - imgDisplayWidth) / 2;
      const y = (pageHeight - imgDisplayHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, imgDisplayWidth, imgDisplayHeight);
      pdf.save("ticket.pdf");
    });
  });

  printBtn.addEventListener("click", () => {
    const renderAndPrint = () => {
      const dataUrl = lastRenderedCanvas.toDataURL();
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Ticket</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
              img { max-width: 100%; max-height: 100%; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print(); window.onafterprint = () => window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    };

    if (lastRenderedCanvas) {
      renderAndPrint();
    } else {
      renderTicketAsCanvas().then(renderAndPrint);
    }
  });
});

window.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const ticketHtml = document.querySelector(".ticket-wrapper");
    const id = sessionStorage.getItem("mockUserId");

    if (!id || !ticketId) {
      console.error("No user ID or ticket ID in sessionStorage");
      return;
    }

    fetch(`https://68137244129f6313e2114929.mockapi.io/registeredUsers/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then((user) => {
        sessionStorage.setItem("userData", JSON.stringify(user));

        if (!Array.isArray(user.history)) {
          user.history = [];
        }

        const alreadyExists = user.history.some(
          (item) => item.ticketId === ticketId.replace(
          "ბილეთი წარმატებით დაიჯავშნა. ბილეთის ნომერია:", "")
        );
        if (alreadyExists) {
          console.log("Ticket already in history. Skipping save.");
          return;
        }

        user.history.push({
          id: user.history.length + 1,
          html: ticketHtml ? ticketHtml.innerHTML : "",
          ticketId: ticketId.replace(
          "ბილეთი წარმატებით დაიჯავშნა. ბილეთის ნომერია:",
          ""),
        });

        return fetch(
          `https://68137244129f6313e2114929.mockapi.io/registeredUsers/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
          }
        );
      })
      .then((res) => {
        if (res && res.ok) {
          console.log("User history updated successfully");
        } else if (res) {
          console.error("Failed to update user history");
        }
      })
      .catch((err) => console.error("Error:", err));
  }, 2000);
});
