let currentLanguage = 'en';
let translations = {};

async function loadLanguage(lang) {
    try {
        const response = await fetch(`language/${lang}.json`);
        if (!response.ok) throw new Error('语言文件加载失败');
        translations = await response.json();
        window.translations = translations;
        currentLanguage = lang;
        updateTexts();
    } catch (e) {
        console.error(e);
    }
}

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    loadLanguage(lang);
}

function updateTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[key]) {
            el.textContent = translations[key];
        }
    });
}

function initI18n() {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
}

document.addEventListener('DOMContentLoaded', initI18n);

// 数字本地化格式化
function formatNumber(num) {
    return new Intl.NumberFormat(currentLanguage).format(num);
}
// 日期本地化格式化
function formatDate(date) {
    return new Intl.DateTimeFormat(currentLanguage, { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}
window.setLanguage = setLanguage;