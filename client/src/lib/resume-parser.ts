// Shared resume file parser. Used by both the wizard upload and the dashboard
// upload card so they speak the same parsed-text format and we have one place
// to fix bugs / add formats.
export async function parseResumeFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth/mammoth.browser");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || "";
  }
  if (name.endsWith(".pdf")) {
    const pdfjsLib: any = await import("pdfjs-dist");
    // Vite-friendly worker URL: ?url returns a hashed asset path that works in dev and prod.
    const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it: any) => it.str).join(" ") + "\n";
    }
    return text;
  }
  if (name.endsWith(".txt")) {
    return await file.text();
  }
  throw new Error("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
}
