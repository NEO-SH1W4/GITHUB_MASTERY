# GitHub Mastery

<div align="center">

![Node.js](https://img.shields.io/badge/node.js-v18+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-stable-brightgreen.svg)
![GitHub Release](https://img.shields.io/badge/release-v1.1.0-orange.svg)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)

**API स्वचालन, एकीकरण, वेबहुक और उन्नत CLI टूल के माध्यम से पूर्ण GitHub प्रभुत्व**

[🌐 **मुखपृष्ठ देखें**](https://neo-sh1w4.github.io/github_mastery/) | [🇧🇷 पुर्तगाली](../pt-br/README.md) | [🇪🇸 स्पैनिश](../es/README.md) | [🇨🇳 चीनी](../zh/README.md) | [🇮🇳 हिंदी](./README.md) | [🇯🇵 जापानी](../ja/README.md) | [🌍 अरबी](../ar/README.md) | [🇩🇪 जर्मन](../de/README.md) | [🇺🇸 अंग्रेजी](../../README.md)

</div>

## ✨ मुख्य विशेषताएं

🔌 **GitHub API क्लाइंट**: प्रमाणीकरण और स्मार्ट दर सीमा के साथ पूर्ण क्लाइंट  
⚡ **इंटरैक्टिव CLI**: सहज प्रॉम्प्ट के साथ शक्तिशाली कमांड-लाइन टूल  
🔗 **वेबहुक सर्वर**: HMAC सुरक्षा के साथ मजबूत GitHub इवेंट सर्वर  
🔄 **CI/CD पाइपलाइन**: GitHub Actions के साथ स्वचालित वर्कफ़्लो  
🛡️ **सुरक्षा पहले**: HMAC सत्यापन, टोकन प्रबंधन और सर्वोत्तम प्रथाएं  
🎨 **समृद्ध UX**: रंगीन आउटपुट और उपयोगकर्ता-अनुकूल इंटरफेस

## 🚀 त्वरित स्थापना

```bash
# क्लोन और सेटअप (HTTPS)
git clone https://github.com/NEO-SH1W4/github-mastery.git

# या SSH का उपयोग करें
git clone git@github.com:NEO-SH1W4/github-mastery.git

# निर्भरताएं स्थापित करें
cd github-mastery
npm install

# पर्यावरण कॉन्फ़िगर करें
cp .env.example .env
# अपना GitHub टोकन .env में जोड़ें

# होमपेज देखें (ब्राउज़र में खोलें)
start index.html  # Windows
# open index.html  # macOS
# xdg-open index.html  # Linux

# CLI शुरू करें
npm start
```

## 💡 त्वरित शुरुआत

### 1. प्रमाणीकरण सेटअप

```bash
# GitHub प्रमाणीकरण सत्यापित करें
node cli-tools/gh-cli.js auth

# खाता स्थिति जांचें
node cli-tools/gh-cli.js status
```

### 2. रिपॉजिटरी संचालन

```bash
# रिपॉजिटरी सूचीबद्ध करें
node cli-tools/gh-cli.js repos --limit 10

# रिपो विवरण प्राप्त करें
node cli-tools/gh-cli.js repo owner repo-name

# रिपॉजिटरी बनाएं (इंटरैक्टिव)
node cli-tools/gh-cli.js create-repo
```

## 📚 दस्तावेज़ीकरण

- 🌐 [**परियोजना मुखपृष्ठ**](../../index.html)
- 🎯 [**लैंडिंग पेज डेमो**](https://neo-sh1w4.github.io/github_mastery/)
- 📖 [**लैंडिंग पेज गाइड**](../../LANDING_PAGE.md)
- 🏃‍♂️ [**त्वरित शुरुआत गाइड**](./QUICKSTART.md)
- 🔌 [**API उपयोग उदाहरण**](../../examples/)
- 🛠️ [**CLI कमांड संदर्भ**](./CLI.md)
- 🔗 [**वेबहुक सेटअप गाइड**](./WEBHOOKS.md)
- 🤝 [**योगदान गाइड**](../../CONTRIBUTING.md)
- 📋 [**चेंजलॉग**](../../CHANGELOG.md)

## 🤝 योगदान

योगदान का स्वागत है! यह परियोजना GitHub स्वचालन के लिए निर्णायक टूलकिट बनने का लक्ष्य रखती है।

1. 🍴 परियोजना को फोर्क करें
2. 🌟 अपनी फीचर ब्रांच बनाएं
3. ✅ टेस्ट जोड़ें (जब उपलब्ध हो)
4. 📝 दस्तावेज़ीकरण अपडेट करें
5. 🚀 पुल रिक्वेस्ट खोलें

[पूर्ण योगदान गाइड](../../CONTRIBUTING.md) देखें।

## 📜 लाइसेंस

यह परियोजना MIT लाइसेंस के तहत लाइसेंस प्राप्त है - विवरण के लिए [LICENSE](../../LICENSE) फ़ाइल देखें।

## 🌟 आभार

डेवलपर समुदाय के लिए ❤️ के साथ बनाया गया। यदि यह परियोजना आपकी मदद करती है, तो कृपया इसे एक ⭐ देने पर विचार करें!

---

<div align="center">

**[🌐 स्थानीय मुखपृष्ठ](../../index.html) • [🎯 लैंडिंग पेज](https://neo-sh1w4.github.io/github_mastery/) • [🏠 GitHub](https://github.com/NEO-SH1W4/github-mastery) • [📖 दस्तावेज़](https://github.com/NEO-SH1W4/github-mastery#readme) • [🐛 मुद्दे](https://github.com/NEO-SH1W4/github-mastery/issues) • [💬 चर्चाएं](https://github.com/NEO-SH1W4/github-mastery/discussions)**

</div>
