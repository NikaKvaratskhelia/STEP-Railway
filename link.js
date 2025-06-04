const indx = +sessionStorage.getItem("linkIndex");
console.log(indx)
const id = sessionStorage.getItem("mockUserId");

fetch(`https://68137244129f6313e2114929.mockapi.io/registeredUsers/${id}`)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);

    document.querySelector(".ticket-wrapper").innerHTML =
      data.history[indx].html;

    const printBtn = document.querySelector(".print");
    const downloadBtn = document.querySelector(".download");
    const ticketEl = document.querySelector(".ticket-info");

    const { jsPDF } = window.jspdf;

    let lastRenderedCanvas = null;

    function renderTicketAsCanvas() {
      return html2canvas(ticketEl, { scale: 2 }).then((canvas) => {
        lastRenderedCanvas = canvas;
        return canvas;
      });
    }

    if (downloadBtn) {
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
    }

    if (printBtn) {
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
    }
  });
