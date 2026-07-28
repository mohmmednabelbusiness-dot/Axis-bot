const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ضع مفتاح Gemini الخاص بك هنا
const genAI = new GoogleGenerativeAI(AQ.Ab8RN6I3WRvfChDTya5knk_ZgW5ZgIZh-23Ut0hmh3-T8_PEPA);

const client = new Client({
    authStrategy: new LocalAuth() 
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('==> الرجاء مسح كود الـ QR باستخدام تطبيق الواتساب الخاص بك');
});

client.on('ready', () => {
    console.log('==> تم الربط بنجاح! بوت Axis يعمل الآن.');
});

client.on('message', async msg => {
    try {
        if(msg.from.includes('@g.us')) return;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        const prompt = `
        أنت مندوب مبيعات ذكي واحترافي تمثل وكالة "Axis" للخدمات الرقمية.
        الخدمات التي نقدمها للعملاء:
        - زيادة المتابعين على جميع منصات التواصل الاجتماعي.
        - توثيق الحسابات بالعلامة الزرقاء.
        
        تعليمات هامة لك:
        1. لدينا حالياً عرض خاص بخصم 25% على جميع الخدمات. استخدم هذا الخصم لإقناع العميل.
        2. تحدث بأسلوب لبق، مباشر، وواثق.
        3. هدفك هو إقناع العميل بجودة خدماتنا وسرعة تنفيذها.
        
        رسالة العميل: ${msg.body}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        msg.reply(text);
        
    } catch (error) {
        console.error('حدث خطأ أثناء معالجة الرسالة:', error);
    }
});

client.initialize();
const http = require('http');
http.createServer((req, res) => res.end('Bot is running')).listen(process.env.PORT || 3000);
