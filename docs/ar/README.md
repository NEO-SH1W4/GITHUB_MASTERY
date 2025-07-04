# GitHub Mastery

cdiv align="center"e

![Node.js](https://img.shields.io/badge/node.js-v18+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-stable-brightgreen.svg)
![GitHub Release](https://img.shields.io/badge/release-v1.1.0-orange.svg)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)

**السيطرة الكاملة على GitHub من خلال أتمتة API والتكاملات وwebhooks وأدوات CLI المتقدمة**

[🌐 **زيارة الصفحة الرئيسية**](https://neo-sh1w4.github.io/github_mastery/) | [🇧🇷 البرتغالية](../pt-br/README.md) | [🇪🇸 الإسبانية](../es/README.md) | [🇨🇳 الصينية](../zh/README.md) | [🇮🇳 الهندية](../hi/README.md) | [🇯🇵 اليابانية](../ja/README.md) | [🌍 العربية](./README.md) | [🇩🇪 الألمانية](../de/README.md) | [🇺🇸 الإنجليزية](../../README.md)

c/dive

## ✨ الميزات الرئيسية

🔌 **عميل GitHub API**: عميل كامل مع المصادقة وتحديد المعدل الذكي  
⚡ **أدوات CLI تفاعلية**: أدوات سطر الأوامر القوية مع مطالبات بديهية  
🔗 **خادم Webhook**: خادم فعال لأحداث GitHub مع أمان HMAC  
🔄 **خط أنابيب CI/CD**: تدفق عمل آلي مع GitHub Actions  
🛡️ **الأمان أولاً**: التحقق من HMAC، إدارة الرموز، وأفضل الممارسات  
🎨 **تجربة مستخدم غنية**: نتائج ملونة وواجهة مستخدم سهلة الاستخدام

## 🚀 التثبيت السريع

```bash
# استنساخ وإعداد (HTTPS)
git clone https://github.com/NEO-SH1W4/github-mastery.git

# أو باستخدام SSH
git clone git@github.com:NEO-SH1W4/github-mastery.git

# تثبيت التبعيات
cd github-mastery
npm install

# تكوين البيئة
cp .env.example .env
# أضف رمز GitHub الخاص بك إلى .env

# عرض الصفحة الرئيسية (فتح في المتصفح)
start index.html  # Windows
# open index.html  # macOS
# xdg-open index.html  # Linux

# بدء تشغيل CLI
npm start
```

## 💡 البدء السريع

### 1. إعداد المصادقة

```bash
# تحقق من مصادقة GitHub
node cli-tools/gh-cli.js auth

# تحقق من حالة الحساب
node cli-tools/gh-cli.js status
```

### 2. عمليات المستودع

```bash
# قائمة المستودعات
node cli-tools/gh-cli.js repos --limit 10

# احصل على تفاصيل المستودع
node cli-tools/gh-cli.js repo owner repo-name

# إنشاء مستودع (تفاعلي)
node cli-tools/gh-cli.js create-repo
```

## 📚 الوثائق

- 🌐 [**الصفحة الرئيسية للمشروع**](../../index.html)
- 🎯 [**عرض الصفحة المقصودة**](https://neo-sh1w4.github.io/github_mastery/)
- 📖 [**دليل الصفحة المقصودة**](../../LANDING_PAGE.md)
- 🏃‍♂️ [**دليل البدء السريع**](./QUICKSTART.md)
- 🔌 [**أمثلة استخدام API**](../../examples/)
- 🛠️ [**مرجع أوامر CLI**](./CLI.md)
- 🔗 [**دليل إعداد Webhook**](./WEBHOOKS.md)
- 🤝 [**دليل المساهمة**](../../CONTRIBUTING.md)
- 📋 [**سجل التغيير**](../../CHANGELOG.md)

## 🤝 المساهمة

المساهمات موضع ترحيب! يهدف هذا المشروع إلى أن يكون المجموعة النهائية لأدوات أتمتة GitHub.

1. 🍴 قم بفرع المشروع
2. 🌟 أنشئ فرع الميزات الخاص بك
3. ✅ أضف الاختبارات (عند توفرها)
4. 📝 حدّث الوثائق
5. 🚀 افتح طلب دمج

شاهد [دليل المساهمة الكامل](../../CONTRIBUTING.md).

## 📜 الترخيص

تم ترخيص هذا المشروع بموجب ترخيص MIT - انظر ملف [LICENSE](../../LICENSE) لمزيد من التفاصيل.

## 🌟 الشكر والامتنان

تم بناء هذا المشروع بحب ❤️ لمجتمع المطورين. إذا ساعدك هذا المشروع، فكر في إعطائه نجمة ⭐!

---

cdiv align="center"e

**[🌐 الصفحة الرئيسية المحلية](../../index.html) • [🎯 الصفحة المقصودة](https://neo-sh1w4.github.io/github_mastery/) • [🏠 GitHub](https://github.com/NEO-SH1W4/github-mastery) • [📖 الوثائق](https://github.com/NEO-SH1W4/github-mastery#readme) • [🐛 المشكلات](https://github.com/NEO-SH1W4/github-mastery/issues) • [💬 المناقشات](https://github.com/NEO-SH1W4/github-mastery/discussions)**

c/dive
