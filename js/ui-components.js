console.log('ui-components loaded');
// UI Components and Event Handlers

// Update category title
function updateCategoryTitle(category) {
    const categoryTitle = document.getElementById('categoryTitle');
    if (categoryTitle) {
        categoryTitle.textContent = '';
    }
}

// Back to home function
function backToHome() {
    document.getElementById('gamePage').classList.add('hidden');
    document.getElementById('homePage').classList.remove('hidden');
   }

// Initialize pagination
function renderPagination(totalPages, currentPage) {
    const container = document.getElementById('pageNumbers');
    if (!container) return;
    container.innerHTML = '';
    // 左箭头
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '←';
    prevBtn.className = 'px-3 py-1 rounded-full' + (currentPage === 1 ? ' bg-gray-800 text-gray-500 cursor-not-allowed' : ' bg-purple-600 text-white hover:bg-purple-700');
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (window.gameData.currentPage > 1) {
            window.gameData.currentPage--;
            displayGames(window.gameData.filteredGames);
        }
    };
    container.appendChild(prevBtn);
    // 页码逻辑
    let pageList = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pageList.push(i);
    } else {
        if (currentPage <= 4) {
            pageList = [1,2,3,4,5,'...',totalPages];
        } else if (currentPage >= totalPages - 3) {
            pageList = [1,'...',totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages];
        } else {
            pageList = [1,'...',currentPage-1,currentPage,currentPage+1,'...',totalPages];
        }
    }
    pageList.forEach(p => {
        if (p === '...') {
            const span = document.createElement('span');
            span.textContent = '...';
            span.className = 'px-2 text-gray-400';
            container.appendChild(span);
        } else {
            const btn = document.createElement('button');
            btn.textContent = p;
            btn.className = 'px-3 py-1 rounded-full' + (p === currentPage ? ' border border-purple-400 text-white' : ' text-purple-200 hover:bg-purple-700');
            btn.disabled = p === currentPage;
            btn.onclick = () => {
                window.gameData.currentPage = p;
                displayGames(window.gameData.filteredGames);
            };
            container.appendChild(btn);
        }
    });
    // 右箭头
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '→';
    nextBtn.className = 'px-3 py-1 rounded-full' + (currentPage === totalPages ? ' bg-gray-800 text-gray-500 cursor-not-allowed' : ' bg-purple-600 text-white hover:bg-purple-700');
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (window.gameData.currentPage < totalPages) {
            window.gameData.currentPage++;
            displayGames(window.gameData.filteredGames);
        }
    };
    container.appendChild(nextBtn);
}
// 修改 initializePagination，移除原有 prev/next 事件，改为：
function initializePagination() {
    document.getElementById('itemsPerPage').addEventListener('change', (e) => {
        window.gameData.gamesPerPage = parseInt(e.target.value);
        window.gameData.currentPage = 1;
        displayGames(window.gameData.filteredGames);
    });
}
// 在 main.js 的 displayGames 末尾调用 renderPagination

// Initialize category filters
function initializeCategoryFilters() {
    document.querySelectorAll('.category-filter').forEach(button => {
        button.addEventListener('click', (e) => {
            const gamePage = document.getElementById('gamePage');
            if (!gamePage.classList.contains('hidden')) {
                backToHome();
            }
            document.querySelectorAll('.category-filter').forEach(btn => {
                btn.classList.remove('active');
            });
            e.currentTarget.classList.add('active');
            // 已删除 window.uiComponents.updateCategoryTitle(category);
        });
    });
    // const urlParams = new URLSearchParams(window.location.search);
    // let category = urlParams.get('category') || 'all';
    // document.querySelectorAll('.category-filter').forEach(btn => {
    //     btn.classList.remove('active');
    // });
    // const targetBtn = document.querySelector('.category-filter[data-category="' + category + '"]');
    // if (targetBtn) {
    //     targetBtn.classList.add('active');
    // }
    // window.uiComponents.updateCategoryTitle(category); // 删除初始化时的标题更新
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    // 新增：创建建议列表容器
    let suggestionBox = document.getElementById('searchSuggestionBox');
    if (!suggestionBox) {
        suggestionBox = document.createElement('div');
        suggestionBox.id = 'searchSuggestionBox';
        suggestionBox.className = 'absolute left-0 right-0 mt-1 bg-gray-800 text-white rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto';
        suggestionBox.style.display = 'none';
        searchInput.parentNode.appendChild(suggestionBox);
    }
    // 获取所有可用关键词（标题、标签、描述）
    function getAllKeywords() {
        if (!window.gameData || !window.gameData.allGames) return [];
        const set = new Set();
        window.gameData.allGames.forEach(game => {
            if (game.title) set.add(game.title);
            // 移除了标签相关的代码
        });
        return Array.from(set).filter(Boolean);
    }
    // 新增样式
    const style = document.createElement('style');
    style.textContent = `
        #searchSuggestionBox::-webkit-scrollbar {
            width: 8px;
        }
        #searchSuggestionBox::-webkit-scrollbar-track {
            background: #2d2d2d;
          border-radius: 20px; /* 新增：轨道圆角 */
        }
        #searchSuggestionBox::-webkit-scrollbar-track {
            background: #2d2d2d;
        }
        #searchSuggestionBox::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 20px;
            border: 2px solid #2d2d2d;
        }
        #searchSuggestionBox div:hover {
            background-color: #555;
        }
    `;
    document.head.appendChild(style);
    // 监听输入事件
    searchInput.setAttribute('autocomplete', 'off');
    searchInput.addEventListener('input', function(e) {
        const value = searchInput.value.trim().toLowerCase();
        if (!value) {
            suggestionBox.style.display = 'none';
            suggestionBox.innerHTML = '';
            return;
        }
        const allKeywords = getAllKeywords();
        // 简单模糊匹配
        const suggestions = allKeywords.filter(k => k.toLowerCase().includes(value) && k.length > 1 && k.toLowerCase() !== value).slice(0, 10);
        if (suggestions.length === 0) {
            suggestionBox.style.display = 'none';
            suggestionBox.innerHTML = '';
            return;
        }
        suggestionBox.innerHTML = suggestions.map(s => `<div class='px-4 py-2 cursor-pointer hover:bg-purple-100 rounded'>${s}</div>`).join('');
        suggestionBox.style.display = 'block';
        // 点击建议填充
        Array.from(suggestionBox.children).forEach((item, idx) => {
            item.addEventListener('mousedown', function(e) {
                e.preventDefault();
                searchInput.value = suggestions[idx];
                suggestionBox.style.display = 'none';
                suggestionBox.innerHTML = '';
                // 触发回车搜索
                const event = new KeyboardEvent('keypress', {key: 'Enter'});
                searchInput.dispatchEvent(event);
            });
        });
    });
    // 失焦隐藏建议
    searchInput.addEventListener('blur', function() {
        setTimeout(() => {
            suggestionBox.style.display = 'none';
        }, 120);
    });
    // 保持原有回车搜索逻辑
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchValue = encodeURIComponent(searchInput.value);
            window.location.href = 'category-detail.html?category=all&search=' + searchValue;
        }
    });
}

// Initialize back to top button
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize back to home button
function initializeBackToHome() {
    const backToHomeBtn = document.getElementById('backToHome');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', backToHome);
    }
}

// Export functions for use in other modules
if (typeof window !== 'undefined') {
    window.uiComponents = {
        updateCategoryTitle,
        backToHome,
        initializePagination,
        initializeCategoryFilters,
        initializeSearch,
        initializeBackToTop,
        initializeBackToHome,
        renderPagination // 新增导出
    };
    window.renderPagination = renderPagination; // 便于 main.js 调用
}

function initializeSidebarCategoryJump() {
    document.querySelectorAll('.category-filter').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const cat = btn.dataset.category;
            document.querySelectorAll('.category-filter').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            if(cat === 'Recommended') {
                window.location.href = 'category-detail.html?sort=newest';
            } else if(cat && cat !== 'home') {
                window.location.href = 'category-detail.html?category=' + cat;
            } else if(cat === 'home') {
                window.location.href = 'index.html?category=home';
            }
        });
    });
}
/**
 * 创建多语言切换按钮并绑定交互逻辑
 * @param {HTMLElement} container 挂载按钮的父节点
 */
function createLanguageSwitcher(container) {
    if (!container) return;
    // 生成按钮结构
    container.innerHTML = `
        <div class="relative">
            <button id="langDropdownBtn" class="flex items-center" style="background:none;border:none;box-shadow:none;padding:0;color:inherit;font:inherit;">
                🌐 <span class="ml-2">Language</span>
                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div id="langDropdown" class="hidden absolute right-0 mt-2 w-36 bg-dark-card border border-purple-500/30 rounded-lg shadow-lg z-50">
                <button onclick="setLanguage('en')" class="block w-full text-left px-4 py-2 hover:bg-purple-500/20 transition-colors" data-i18n="lang_en">English</button>
                <button onclick="setLanguage('zh')" class="block w-full text-left px-4 py-2 hover:bg-purple-500/20 transition-colors" data-i18n="lang_zh">简体中文</button>
                <button onclick="setLanguage('ja')" class="block w-full text-left px-4 py-2 hover:bg-purple-500/20 transition-colors" data-i18n="lang_ja">日本語</button>
                <button onclick="setLanguage('ko')" class="block w-full text-left px-4 py-2 hover:bg-purple-500/20 transition-colors" data-i18n="lang_ko">한국어</button>
                <button onclick="setLanguage('fr')" class="block w-full text-left px-4 py-2 hover:bg-purple-500/20 transition-colors" data-i18n="lang_fr">Français</button>
                <button onclick="setLanguage('es')" class="block w-full text-left px-4 py-2 hover:bg-purple-500/20 transition-colors" data-i18n="lang_es">Español</button>
                <button onclick="setLanguage('de')" class="block w-full text-left px-4 py-2 hover:bg-purple-500/20 transition-colors" data-i18n="lang_de">Deutsch</button>
                <button onclick="setLanguage('ru')" class="block w-full text-left px-4 py-2 hover:bg-purple-500/20 transition-colors" data-i18n="lang_ru">Русский</button>
                <button onclick="setLanguage('ar')" class="block w-full text-left px-4 py-2 hover:bg-purple-500/20 transition-colors" data-i18n="lang_ar">العربية</button>
            </div>
        </div>
    `;
    // 绑定交互逻辑
    const langBtn = container.querySelector('#langDropdownBtn');
    const langDropdown = container.querySelector('#langDropdown');
    if(langBtn && langDropdown){
        langBtn.addEventListener('click', function(e){
            e.stopPropagation();
            langDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', function(){
            langDropdown.classList.add('hidden');
        });
        langDropdown.addEventListener('click', function(e){
            e.stopPropagation();
        });
    }
}
window.uiComponents = window.uiComponents || {};
window.uiComponents.createLanguageSwitcher = createLanguageSwitcher;
window.uiComponents.initializeSidebarCategoryJump = initializeSidebarCategoryJump;

// 移动端汉堡菜单交互
window.addEventListener('DOMContentLoaded', function() {
    var menuBtn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    var closeBtn = document.getElementById('mobile-menu-close');
    // 新增：移动端菜单分类按钮渲染
    var mobileMenuCategories = document.getElementById('mobile-menu-categories');
    if(mobileMenuCategories && window.categoryList) {
        window.uiComponents.createCategoryButtons(
            mobileMenuCategories,
            window.categoryList,
            function(cat, btn, e) {
                // 关闭菜单并跳转
                menu.classList.add('-translate-y-full');
                setTimeout(function(){ menu.classList.add('hidden'); }, 300);
                if(cat.dataCategory === 'home') {
                    window.location.href = 'index.html?category=home';
                } else if(cat.dataCategory === 'Recommended') {
                    window.location.href = 'category-detail.html?sort=newest';
                } else {
                    window.location.href = 'category-detail.html?category=' + cat.dataCategory;
                }
            },
            ''
        );
    }
    if(menuBtn && menu && closeBtn) {
        menuBtn.addEventListener('click', function() {
            menu.classList.remove('hidden');
            setTimeout(function(){
                menu.classList.remove('-translate-y-full');
            }, 10);
        });
        closeBtn.addEventListener('click', function() {
            menu.classList.add('-translate-y-full');
            setTimeout(function(){
                menu.classList.add('hidden');
            }, 300);
        });
        // 点击遮罩关闭
        menu.addEventListener('click', function(e) {
            if(e.target === menu) {
                menu.classList.add('-translate-y-full');
                setTimeout(function(){
                    menu.classList.add('hidden');
                }, 300);
            }
        });
    }
});

/**
 * 渲染分类按钮到指定容器
 * @param {HTMLElement} container 挂载按钮的父节点
 * @param {Array} categories 分类数组，每项应包含 name、icon、dataCategory
 * @param {Function} onClick 点击事件处理函数，参数为当前分类对象
 * @param {string} extraClass 附加class（可选）
 */
function createCategoryButtons(container, categories, onClick, extraClass = '') {
    if (!container || !Array.isArray(categories)) return;
    container.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `category-filter flex items-center gap-2 px-4 py-2 my-1 rounded-lg text-white hover:bg-purple-700 transition-colors ${extraClass}`;
        btn.setAttribute('data-category', cat.dataCategory || cat.name);
        btn.innerHTML = `<span class=\"text-xl\">${cat.icon || ''}</span><span>${cat.name}</span>`;
        btn.addEventListener('click', e => {
            if (typeof onClick === 'function') onClick(cat, btn, e);
        });
        container.appendChild(btn);
    });
}
window.uiComponents = window.uiComponents || {};
window.uiComponents.createCategoryButtons = createCategoryButtons;
window.uiComponents.initializeSidebarCategoryJump = initializeSidebarCategoryJump;

// 移动端汉堡菜单交互
window.addEventListener('DOMContentLoaded', function() {
    var menuBtn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    var closeBtn = document.getElementById('mobile-menu-close');
    if(menuBtn && menu && closeBtn) {
        menuBtn.addEventListener('click', function() {
            menu.classList.remove('hidden');
            setTimeout(function(){
                menu.classList.remove('-translate-y-full');
            }, 10);
        });
        closeBtn.addEventListener('click', function() {
            menu.classList.add('-translate-y-full');
            setTimeout(function(){
                menu.classList.add('hidden');
            }, 300);
        });
        // 点击遮罩关闭
        menu.addEventListener('click', function(e) {
            if(e.target === menu) {
                menu.classList.add('-translate-y-full');
                setTimeout(function(){
                    menu.classList.add('hidden');
                }, 300);
            }
        });
    }
});