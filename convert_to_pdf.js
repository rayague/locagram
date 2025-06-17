const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function convertHtmlToPdf(htmlFile, pdfFile) {
  try {
    // Lancer le navigateur
    const browser = await puppeteer.launch({
      headless: "new",
    });
    const page = await browser.newPage();

    // Lire le fichier HTML
    const html = fs.readFileSync(htmlFile, "utf8");
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // Générer le PDF
    await page.pdf({
      path: pdfFile,
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    });

    await browser.close();
    console.log(`PDF généré avec succès : ${pdfFile}`);
  } catch (error) {
    console.error("Erreur lors de la conversion :", error);
  }
}

// Convertir les fichiers
async function convertAll() {
  const files = [
    {
      html: "terms_template.html",
      pdf: "TERMS_OF_SERVICE.pdf",
    },
    {
      html: "privacy_template.html",
      pdf: "PRIVACY_POLICY.pdf",
    },
  ];

  for (const file of files) {
    await convertHtmlToPdf(
      path.join(__dirname, file.html),
      path.join(__dirname, file.pdf)
    );
  }
}

convertAll();
