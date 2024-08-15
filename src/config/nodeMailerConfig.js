const nodemailer = require('nodemailer');

// Cấu hình transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.NODEMAILER_USER || 'thawponsgatcant@gmail.com',
        pass: process.env.NODEMAILER_PASS || 'zszm qwfi qlkd xace'
    }
});

const sendMail = async (title, content, emailReceived) => {
    try {
        const mailOptions = {
            from: process.env.NODEMAILER_USER || 'thawponsgatcant@gmail.com',
            to: Array.isArray(emailReceived) ? emailReceived.join(', ') : emailReceived, // gửi nhiều người hoặc 1 người
            subject: title,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>${title}</h2>
                    <p>${content}</p>
                    <img src="https://res.cloudinary.com/diges8hpb/image/upload/v1723454158/sclogo_pit5fd.jpg" alt="Logo" style="width: 150px; height: auto;" />
                </div>
            `,
        };

        // Gửi email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};

module.exports = sendMail;
