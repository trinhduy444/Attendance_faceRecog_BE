require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME || 'diges8hpb',
    api_key: process.env.CLOUDINARY_APIKEY || '863579243165465',
    api_secret: process.env.CLOUDINARY_APISECRET || '4EDP-poLXWBWOVtTCZCv5EZ_v8k' 
});
const CLOUDINARY_FOLDER = 'Attendance_System';
const CLOUDINARY_FOLDER2 = 'Attendance_Data';
const CLOUDINARY_FOLDER3 = 'Request_Image';
const CLOUDINARY_FOLDER4 = 'User_Face';



module.exports = { cloudinary,CLOUDINARY_FOLDER,CLOUDINARY_FOLDER2,CLOUDINARY_FOLDER3,CLOUDINARY_FOLDER4 };

// (async function () {
//     // CLOUDINARY_URL=cloudinary://863579243165465:4EDP-poLXWBWOVtTCZCv5EZ_v8k@diges8hpb
//     // Configuration
//     cloudinary.config({
//         cloud_name: 'diges8hpb',
//         api_key: '863579243165465',
//         api_secret: '4EDP-poLXWBWOVtTCZCv5EZ_v8k' // Click 'View Credentials' below to copy your API secret
//     });

//     // Upload an image
//     const uploadResult = await cloudinary.uploader
//         .upload(
//             'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//             public_id: 'shoes',
//         }
//         )
//         .catch((error) => {
//             console.log(error);
//         });

//     console.log(uploadResult);

//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });

//     console.log(optimizeUrl);

//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 900,
//         height: 1600,
//     });

//     console.log(autoCropUrl);
// })();