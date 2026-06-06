import nodemailer from "nodemailer";
import dns from "dns";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

dns.setDefaultResultOrder("ipv4first");

const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 465);
const EMAIL_SECURE = String(process.env.EMAIL_SECURE || "true").toLowerCase() === "true";
const EMAIL_REQUIRE_TLS = String(process.env.EMAIL_REQUIRE_TLS || (!EMAIL_SECURE ? "true" : "false")).toLowerCase() === "true";

export const getEmailFromAddress = () => {
  const fallbackAddress = process.env.EMAIL_USER;
  const configuredAddress = String(process.env.EMAIL_FROM || "").trim();

  if (!configuredAddress) {
    return fallbackAddress;
  }

  if (configuredAddress.includes("yourgmail") || configuredAddress.includes("your_gmail_app_password")) {
    return fallbackAddress;
  }

  return configuredAddress;
};

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  requireTLS: EMAIL_REQUIRE_TLS,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export default transporter;
