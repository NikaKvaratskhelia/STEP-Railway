const myForm = document.querySelector(".my-form");
const textInput = document.getElementById("textInput");
const chosenSeatIDs = JSON.parse(sessionStorage.getItem("chosenSeatIDs"));
const ticketId = sessionStorage.getItem("ticket-id");
const container = document.querySelector(".container");
const cardOwner = sessionStorage.getItem("cardOwner");
const cardNumber = sessionStorage.getItem("cardNum");
const passengersCount = sessionStorage.getItem("passengerCount");
const theTrain = JSON.parse(sessionStorage.getItem("theTrain"));
const georgianFullDate = sessionStorage.getItem("georgianFullDate");
const passEmail = sessionStorage.getItem("passEmail");
const passPhoneNum = sessionStorage.getItem("passPhoneNum");
const ticketinfo = document.querySelector(".ticket-info");
const total = sessionStorage.getItem("total");
const today = new Date();
const formattedDate = `${
  today.getMonth() + 1
}-${today.getDate()}-${today.getFullYear()}`;
const deleteTicket = document.querySelector(".delete-ticket");
const errorDiv = document.querySelector(".error");
const georgianDayNumber = sessionStorage.getItem("georgianDayNumber");
const georgianMonthName = sessionStorage.getItem("georgianMonthName");
const georgianWeekDay = sessionStorage.getItem("georgianWeekDay");

deleteTicket.addEventListener("click", function () {
  const ticketId = sessionStorage.getItem("ticketId");
  const mockUserId = sessionStorage.getItem("mockUserId");

  fetch(`https://railway.stepprojects.ge/api/tickets/cancel/${ticketId}`, {
    method: "DELETE",
  })
    .then((res) => res.text())
    .then(() => {
      container.style.display = "none";
      errorDiv.style.display = "flex";
      errorDiv.innerHTML =
        "<p data-translate='ბილეთი წარმატებით წაიშალა!'>ბილეთი წარმატებით წაიშალა!</p>";

      console.log("Deleting ticket, sending notification...");

      return fetch(
        "https://68137244129f6313e2114929.mockapi.io/adminNotifications",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `User ID:${mockUserId} just canceled ticket`,
            type: "ticketDeleted",
            timestamp: new Date().toISOString(),
          }),
        }
      );
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("Notification sent:", data);
    })
    .catch((error) => {
      errorDiv.style.display = "flex";
      errorDiv.innerHTML =
        "<p data-translate='ბილეთი ვერ წაიშალა!'>ბილეთი ვერ წაიშალა!</p>";
      console.error("Error:", error);
    });
});

myForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const ticketId = textInput.value.trim();
  sessionStorage.setItem("ticketId", ticketId);
  fetch(`https://railway.stepprojects.ge/api/tickets/checkstatus/${ticketId}`)
    .then((res) => res.json())
    .then((data) => {
      container.style.display = "flex";
      ticketinfo.innerHTML = `<div class="company-name">
        <p>Step Railway</p>
        <img src="Images/stepLogo.jpg" alt="Step Logo" />
    </div>
    
    <div class="ticket-id-date">
        <p><span data-translate="ბილეთის ნომერი:">ბილეთის ნომერი:</span> ${data.id}</p>
    
        <p><span data-translate="გაცემის თარიღი:">გაცემის თარიღი:</span> ${data.date}</p>
    </div>
    
    <div class="train-info">
        <div>
            <p data-translate="გასვლა">გასვლა:</p>
            <p>${data.train.departure}</p>
        </div>
        <div>
            <p data-translate="ჩასვლა">ჩასვლა:</p>
            <p>${data.train.arrive}</p>
        </div>
        <div>
            <p data-translate="გასვლის თარიღი:">გასვლის თარიღი:</p>
            <p>${data.date}</span></p>
        </div>
    </div>
    
    <div class="contact-info">
        <p data-translate="საკონტაქტო ინფორმაცია">საკონტაქტო ინფორმაცია:</p>
        <div>
            <p><span data-translate="იმეილი:">იმეილი:</span> ${data.email}</p>
            <p><span data-translate="ნომერი">ნომერი:</span> ${data.phone}</p>
        </div>
    </div>

    <div class="passengers-div">
    <p data-translate="მგზავრები">მგზავრები</p>
        <div class='passengers-info'>
        
        </div>
    </div> 
    
    <div class="payment-info">
      <div class='total'>
      <p data-translate="სულ გადახდილი:">სულ გადახდილი:</p>
        <p>${data.ticketPrice}₾</p>
      </div>
    </div>

    <div class="invoice-copyright">
      <p data-translate="ინვოისი იქმნება კომპიუტერის მიერ და ვალიდურია ბეჭედის და ხელმოწერის გარეშე">ინვოისი იქმნება კომპიუტერის მიერ და ვალიდურია ბეჭედის და ხელმოწერის გარეშე</p>
      <p data-translate="გადმოწერეთ ბილეთი ან შეინახეთ ბილეთის ნომერი ადგილზე წარსადგენად.">გადმოწერეთ ბილეთი ან შეინახეთ ბილეთის ნომერი ადგილზე წარსადგენად.<p>
    </div>
    `;
      const passengersDiv = document.querySelector(".passengers-info");

      passengersDiv.innerHTML = "";
      data.persons.forEach((passenger) => {
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
                  <p>${passenger.seat.number}</p>
              </div>
  
              <div>
                  <p data-translate="ვაგონის N:">ვაგონის N:</p>
                  <p>${passenger.seat.vagonId}</p>
              </div>
          </div>
        `;
      });
    })
    .catch((error) => {
      container.style.display = "none";
      errorDiv.style.display = "flex";
      errorDiv.innerHTML =
        "<p data-translate='ასეთი ბილეთი არ მოიძებნა, შეამოწმეთ ბილეთის ნომერი'>ასეთი ბილეთი არ მოიძებნა, შეამოწმეთ ბილეთის ნომერი</p>";
      console.log(error);
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
