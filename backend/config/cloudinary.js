const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dy8mbtcal', 
  api_key: '813694862382495', 
  api_secret: "P00LxJjFP98E12R10ErIuYMq3kQ",
});

module.exports = cloudinary;
