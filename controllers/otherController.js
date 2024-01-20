import { catchAsyncError } from "../middlewares/catchAsynError.js";
import { sendEmail } from "../utils/sendEmail.js";

//contact us
export const contactUs = catchAsyncError(async (req, res) => {

    const { name, email, phone, message } = req.body;

    const from = `${phone} ${email}`;
    const to = process.env.SMTP_USER;
    const subject = name;
    const text = message;
    await sendEmail(from, to, subject, text);

    res.status(200).json({
        success: true,
        message: "Your message has been sent successfully"
    })

})