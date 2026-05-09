import express from "express";
import {
	register,
	login,
	sendOtp,
	verifyOtpAndLogin,
} from "../controllers/authController.js";
import transporter from "../config/mailer.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndLogin);

// Temporary debug route: remove after verification
router.get("/test-mail", async (req, res) => {
	try {
		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to: process.env.EMAIL_USER,
			subject: "Test",
			text: "Working",
		});

		res.send("Mail Sent");
	} catch (err) {
		console.error("test-mail failed:", err?.message || err);
		res.status(500).send(err?.message || "Mail failed");
	}
});

export default router;