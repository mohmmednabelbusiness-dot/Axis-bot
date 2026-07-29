const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI("AQ.Ab8RN6I3WRvfChDTya5knk_ZgW5ZgIZh-23Ut0hmh3-T8_PEPA");

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', async (qr) => {
    console.log('انسخ هذا الرابط وافتحه في المتصفح لرؤية كود الـ QR بوضوح كصورة:');
    console.log(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`);
});

client.on('ready', () => {
    console.log('تم ربط Axis بنجاح!');
});

client.on('message', async msg => {
    try {
        if (msg.from.includes('@g.us')) return;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `أنت مندوب مبيعات لشركة "Axis"، أجب على العميل بذكاء واحترافية.
خدماتنا:
1. إنشاء متاجر إلكترونية ومواقع.
2. إدارة الحملات والإعلانات الممولة.
3. برمجة روبوتات الرد الآلي (وتساب، تلجرام).

العرض الحالي: خصم 25% على جميع الخدمات.
رسالة العميل: ${msg.body}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        msg.reply(text);

    } catch (error) {
        console.error('حدث خطأ:', error);
    }
});

client.initialize();
