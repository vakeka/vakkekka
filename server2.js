import express from "express";
import fs from "fs";
import path from "path";
import { google } from "googleapis";

const app = express();
app.use(express.json());


const SHEET_ID = "1d3yImsbcx_AJXY5TIMcu2CpTy_aK4jRtv7ewlkFEX5I";

const GOOGLE_CREDS_BASE64 = "ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAicHVmZi00NzUzMjEiLAogICJwcml2YXRlX2tleV9pZCI6ICIwYmIxYzZmYWJlMzA0YjQyMWY1ZGJjNGEyZTg2YzNjN2RmMjBkOGE1IiwKICAicHJpdmF0ZV9rZXkiOiAiLS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tXG5NSUlFdklCSUFEQU5CZ2txaGtpRzl3MEJBUUVGQXlJQkFRQ0FnRUFBcUdSRzRQdjhXbldiVGtQYlVpOEhtOHA5WUtNbWx2UEhObmk0QVo1ZkRmQlpjcmRmUEFuNW52N2NyekpteGdwZ25OTUJnMHlMZ0llU1UrTzhWXGF5eDhrTHBseXI4R3NNa1JlSFlsbXZyUmtVZHBZZS9lMExnR2VkSXpMdGlXZVVBemRZdHp2R01Td0pyclB0aE1sdlZ6ejhvL001aHFTQlY3TDkzQTQ5VXJlWE9jcmVFSG5SVitvT247emtMNEVuN3F6Wi83bWlJOWxFdGtkR2kyMHF1VStkS2JjZzlxeTgxY3lndnY1dkwrZmwvYjRrWVJRdTRPb0ZwVm42Z3FWZmdyRTVyOTdUTlQ2N1FYTEgzcnhxOCtLYkoweDRhaGRhU2h6aFRMUzd4TlZsdXRHMm1weWhKS2h4MlhsM21XUlozSFRBN2E2UllRamI0MThqdzR5UzJVbC9BZ01CQVFDU2JFcU5qS0U1S0xTN0lTTk84K3FoMFpRVXpQQ2JFeEZFd0RMODVFQ2dZQnA2QzRyL1BKS0lkSTBiV3dZNnIzdTg4OWhvYVhaV1d3TWxOWUNuUGMrc0EzMnAxUVZpM0RFTFJCbyt0dDRvTk1EZmNub0orSzhHR0dmNE4xS1lKNGtQT2FJQzAraXhld0EzQ0dIZ3d6eDdUcis9XG4tLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tXG4iLAogICJjbGllbnRfZW1haWwiOiAicHVmZmdvLXNlcnZlckBwdWZmLTQ3NTMyMS5pYW0uZ3NlcnZpY2FjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjExNTg2Nzc4NDY0MjE1MjE2OTg2MCIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhLHg1MDkvcHVmZmdvLXNlcnZlckBwdWZmLTQ3NTMyMS5pYW0uZ3NlcnZpY2FjY291bnQuY29tIiwKICAidW5pdmVyc2VfZG9tYWluIjogImdvb2dsZWFwaXMuY29tIg0K";


try {
  const credsBuffer = Buffer.from(GOOGLE_CREDS_BASE64, "base64");
  fs.writeFileSync(path.join(process.cwd(), "puffgo-credentials.json"), credsBuffer);
} catch (error) {
  console.error("Ошибка при создании файла credentials.json:", error);
  process.exit(1);
}


const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "puffgo-credentials.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

async function getSheets() {
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
}


app.get("/api/devices", async (req, res) => {
  try {
    const sheets = await getSheets();
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Товары!A2:F",
    });

    const rows = result.data.values || [];
    const devices = rows
      .filter(r => r[4] === "Устройство")
      .map(r => ({
        code: r[0],
        name: r[1],
        qty: Number(r[2]) || 0,
        price: Number(r[3]) || 0,
        flavors: r[5] ? r[5].split(",").map(f => f.trim()) : [],
      }));

    res.json({ devices });
  } catch (err) {
    console.error("Ошибка при загрузке устройств:", err);
    res.status(500).json({ message: "Ошибка при загрузке устройств" });
  }
});


app.get("/health", (req, res) => {
  try {
    res.json({ ok: true });
  } catch (err) {
    console.error("Ошибка в health endpoint:", err);
    res.status(500).json({ ok: false });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});