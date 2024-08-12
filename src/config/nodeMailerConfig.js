const nodemailer = require('nodemailer');

// Cấu hình transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'thawponsgatcant@gmail.com',
        pass: 'zszm qwfi qlkd xace'
    }
});

// Hàm sendMail
const sendMail = async (title, content, emailReceived) => {
    try {
        const mailOptions = {
            from: 'thawponsgatcant@gmail.com', // Địa chỉ email của bạn
            to: Array.isArray(emailReceived) ? emailReceived.join(', ') : emailReceived, // gửi nhiều người hoặc 1 người
            subject: title, // Tiêu đề email
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
