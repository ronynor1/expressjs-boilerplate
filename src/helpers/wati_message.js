const axios = require('axios');
const logger = require('../helpers/logger.js')(module);

exports.sendWhatsappMessage = (phone, message) => {

    const token = process.env.CHAT_API_TOKEN;
    const instanceId = process.env.CHAT_API_INSTANCE_ID;
    const url = `https://api.chat-api.com/instance${instanceId}/sendMessage?token=${token}`;

    let data = {
        phone: phone, // Receivers phone
        body: message
    };
    
    axios.post(url, data)
    .catch( (error) => {
        logger.error(error.message);
        console.error('Configure Whatsapp Settings')
    });

}