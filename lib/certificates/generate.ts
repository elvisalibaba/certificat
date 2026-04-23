import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

export function createCertificateNumber(sequence: number) {
  return `CERT-ART-${new Date().getFullYear()}-${String(sequence).padStart(6, "0")}`;
}

export async function createQrCodeDataUrl(publicUrl: string) {
  return QRCode.toDataURL(publicUrl, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 320,
  });
}

function drawCenteredText(page: import("pdf-lib").PDFPage, text: string, y: number, size: number, font: import("pdf-lib").PDFFont, color = rgb(0.08, 0.11, 0.1)) {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: (842 - width) / 2, y, size, font, color });
}

function drawField(page: import("pdf-lib").PDFPage, label: string, value: string, x: number, y: number, font: import("pdf-lib").PDFFont, bold: import("pdf-lib").PDFFont) {
  page.drawText(label.toUpperCase(), { x, y, size: 8, font: bold, color: rgb(0.42, 0.39, 0.34) });
  page.drawText(value || "Non renseigne", { x, y: y - 18, size: 12, font, color: rgb(0.08, 0.11, 0.1) });
  page.drawLine({ start: { x, y: y - 26 }, end: { x: x + 260, y: y - 26 }, thickness: 0.6, color: rgb(0.78, 0.73, 0.65) });
}

function wrapText(text: string, maxChars: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

export async function createCertificatePdf(input: {
  certificateNumber: string;
  productName: string;
  category: string;
  producerName: string;
  workshopName?: string | null;
  artisanIdentifier?: string | null;
  requestNumber?: string | null;
  productCode?: string | null;
  origin?: string | null;
  province?: string | null;
  legalBasis?: string | null;
  issuingAuthority?: string | null;
  signedByName?: string | null;
  signedByTitle?: string | null;
  verificationUrl: string;
  issuedAt: Date;
  expiresAt?: Date | null;
}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const qrDataUrl = await createQrCodeDataUrl(input.verificationUrl);
  const qrBytes = Uint8Array.from(Buffer.from(qrDataUrl.split(",")[1], "base64"));
  const qrPng = await pdf.embedPng(qrBytes);

  const green = rgb(0.02, 0.22, 0.16);
  const gold = rgb(0.88, 0.68, 0.12);
  const red = rgb(0.62, 0.08, 0.1);
  const ink = rgb(0.08, 0.11, 0.1);
  const muted = rgb(0.42, 0.39, 0.34);

  page.drawRectangle({ x: 26, y: 26, width: 790, height: 543, borderColor: green, borderWidth: 2.2 });
  page.drawRectangle({ x: 38, y: 38, width: 766, height: 519, borderColor: gold, borderWidth: 0.9 });
  page.drawRectangle({ x: 58, y: 430, width: 726, height: 86, color: rgb(0.96, 0.95, 0.91) });
  page.drawCircle({ x: 104, y: 473, size: 31, borderColor: green, borderWidth: 1.5 });
  page.drawText("RDC", { x: 82, y: 464, size: 19, font: bold, color: green });
  page.drawCircle({ x: 738, y: 473, size: 31, borderColor: green, borderWidth: 1.5 });
  page.drawText("ANCA", { x: 714, y: 465, size: 14, font: bold, color: green });

  drawCenteredText(page, "REPUBLIQUE DEMOCRATIQUE DU CONGO", 496, 12, bold, green);
  drawCenteredText(page, input.issuingAuthority ?? "Ministere des PME et Artisanat", 478, 11, font, muted);
  drawCenteredText(page, "CERTIFICAT DE CONFORMITE ARTISANALE", 446, 25, bold, ink);
  drawCenteredText(page, input.certificateNumber, 418, 13, bold, red);

  page.drawText("Il est certifie que le produit artisanal ci-dessous a ete instruit, controle et approuve selon le processus officiel de certification.", {
    x: 88,
    y: 386,
    size: 11,
    font,
    color: muted,
  });

  drawField(page, "Produit certifie", input.productName, 88, 348, font, bold);
  drawField(page, "Categorie", input.category, 388, 348, font, bold);
  drawField(page, "Producteur / artisan", input.producerName, 88, 292, font, bold);
  drawField(page, "Atelier", input.workshopName ?? input.producerName, 388, 292, font, bold);
  drawField(page, "Reference dossier", input.requestNumber ?? input.certificateNumber, 88, 236, font, bold);
  drawField(page, "Code produit", input.productCode ?? "Non attribue", 388, 236, font, bold);
  drawField(page, "Origine / province", input.province ?? input.origin ?? "RDC", 88, 180, font, bold);
  drawField(page, "Identifiant artisan", input.artisanIdentifier ?? "Non renseigne", 388, 180, font, bold);

  const issued = input.issuedAt.toLocaleDateString("fr-FR");
  const expires = input.expiresAt ? input.expiresAt.toLocaleDateString("fr-FR") : "Non applicable";
  page.drawText(`Delivre a Kinshasa, le ${issued}`, { x: 88, y: 112, size: 11, font, color: ink });
  page.drawText(`Valable jusqu'au ${expires}`, { x: 88, y: 94, size: 11, font, color: ink });

  const basisLines = wrapText(input.legalBasis ?? "Certificat delivre apres validation administrative, inspection et/ou analyse technique selon la categorie du produit.", 82);
  basisLines.forEach((line, index) => {
    page.drawText(line, { x: 88, y: 72 - index * 13, size: 9, font, color: muted });
  });

  page.drawImage(qrPng, { x: 645, y: 72, width: 104, height: 104 });
  page.drawText("Verification publique", { x: 643, y: 55, size: 9, font: bold, color: green });
  page.drawText(input.verificationUrl, { x: 548, y: 42, size: 7.5, font, color: green });

  page.drawLine({ start: { x: 548, y: 146 }, end: { x: 624, y: 146 }, thickness: 0.7, color: ink });
  page.drawText(input.signedByName ?? "Autorite habilitee", { x: 548, y: 128, size: 10, font: bold, color: ink });
  page.drawText(input.signedByTitle ?? "Direction de la certification", { x: 548, y: 113, size: 8.5, font, color: muted });

  return pdf.save();
}
