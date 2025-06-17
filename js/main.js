// Main application logic

// Global game data
window.gameData = {
    allGames: [],
    filteredGames: [],
    currentPage: 1,
    gamesPerPage: 48, // 默认每页48个
    categoryMappings: {},
    categoryInfo: {}
};

// Display games function
function displayGames(games) {
    const gamesContainer = document.getElementById('gamesGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    if (!gamesContainer) return;
    
    // Show loading spinner
    if (loadingSpinner) {
        loadingSpinner.style.display = 'flex';
    }
    
    // Clear container
    gamesContainer.innerHTML = '';
    
    if (games.length === 0) {
        // 无结果时显示提示和推荐
        const urlParams = new URLSearchParams(window.location.search);
        let search = urlParams.get('search') || '';
        const tip = document.createElement('div');
        tip.className = 'col-span-full text-center text-lg text-gray-300 mb-6';
        tip.innerHTML = `搜索结果为0，可以试玩以下游戏：`;
        gamesContainer.appendChild(tip);
        // 随机推荐18个游戏
        const randomGames = window.gameData.allGames
            .filter(g => !window.gameData.filteredGames.includes(g))
            .sort(() => Math.random() - 0.5)
            .slice(0, 18);
        randomGames.forEach(game => {
            const card = window.createGameCard ? window.createGameCard(game) : createGameCard(game);
            gamesContainer.appendChild(card);
        });
        // 隐藏分页
        const pageNumbers = document.getElementById('pageNumbers');
        if (pageNumbers) pageNumbers.innerHTML = '';
        // 隐藏分页信息
        updatePaginationInfo(0);
        // 隐藏loading
        setTimeout(() => {
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
        }, 300);
        return;
    }
    
    // Calculate pagination
    const startIndex = (window.gameData.currentPage - 1) * window.gameData.gamesPerPage;
    const endIndex = startIndex + window.gameData.gamesPerPage;
    const gamesToShow = games.slice(startIndex, endIndex);
    
    // Create game cards
    gamesToShow.forEach(game => {
        const gameCard = createGameCard(game);
        gamesContainer.appendChild(gameCard);
    });
    
    // Update pagination info
    updatePaginationInfo(games.length);
    // 渲染分页组件
    const totalPages = Math.ceil(games.length / window.gameData.gamesPerPage);
    if (window.renderPagination) {
        window.renderPagination(totalPages, window.gameData.currentPage);
    }
    // 新增：翻页后自动回到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Hide loading spinner
    setTimeout(() => {
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
    }, 300);
}

// Update pagination information
function updatePaginationInfo(totalGames) {
    const totalPages = Math.ceil(totalGames / window.gameData.gamesPerPage);
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const currentPageDisplay = document.getElementById('currentPageDisplay');
    const totalPagesDisplay = document.getElementById('totalPagesDisplay');
    
    if (pageInfo) {
        pageInfo.textContent = `Page ${window.gameData.currentPage} of ${totalPages}`;
    }
    
    if (currentPageDisplay) {
        currentPageDisplay.textContent = window.gameData.currentPage;
    }
    
    if (totalPagesDisplay) {
        totalPagesDisplay.textContent = totalPages;
    }
    
    if (prevBtn) {
        prevBtn.disabled = window.gameData.currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = window.gameData.currentPage === totalPages || totalPages === 0;
    }
}

// Filter games function
function filterGames(category, searchTerm = '', sort = '') {
    let filtered = window.gameData.allGames;
    if (category && category !== 'all') {
        const categoryTags = window.gameData.categoryMappings[category] || [];
        filtered = filtered.filter(game => {
            if (!game.tags) return false;
            const gameTags = game.tags.split(',').map(tag => tag.trim().toLowerCase());
            return categoryTags.some(categoryTag => 
                gameTags.includes(categoryTag.toLowerCase())
            );
        });
    }
    // sort=newest时只取最新48个
    if (sort === 'newest') {
        filtered = filtered.slice(6, 48);
    }
    window.gameData.gamesPerPage = 48;
    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(game => 
            game.title.toLowerCase().includes(searchLower) ||
            game.description.toLowerCase().includes(searchLower) ||
            (game.tags && game.tags.toLowerCase().includes(searchLower))
        );
    }
    window.gameData.filteredGames = filtered;
    window.gameData.currentPage = 1;
    displayGames(filtered);
}

// Initialize the application
function initializeApp() {
    // Load game data
    function formatGameCount(count) {
        if (count >= 1000) {
            return Math.floor(count / 1000) * 1000 + '+';
        } else if (count >= 100) {
            return Math.floor(count / 100) * 100 + '+';
        }
        return count.toString();
    }
    
    loadGamesData().then((games) => {
        window.gameData.allGames = games;
        const displayedGamesElement = document.getElementById('displayedGames');
        if (displayedGamesElement) {
            displayedGamesElement.textContent = formatGameCount(games.length);
        }
        // 添加这两行来初始化分类映射和信息
        window.gameData.categoryMappings = window.categoryMappings;
        window.gameData.categoryInfo = window.categoryInfo;
        
        if (window.uiComponents) {
            window.uiComponents.initializePagination();
            window.uiComponents.initializeCategoryFilters();
            window.uiComponents.initializeSearch();
            window.uiComponents.initializeBackToTop();
            window.uiComponents.initializeBackToHome();
        }
        
        // 检查URL参数并应用分类筛选
        const urlParams = new URLSearchParams(window.location.search);
        let category = urlParams.get('category');
        if (!category) category = 'all'; // 默认全部
        // 在initializeApp函数内，filterGames(category, '')之前添加如下代码
        // 渲染最新6个游戏到newGamesGrid
        const newGamesGrid = document.getElementById('newGamesGrid');
        if (newGamesGrid && games.length > 0) {
            newGamesGrid.innerHTML = '';
            // 取最新的6个游戏（假设games已按最新排序）
            const latestGames = games.slice(0,6);
            latestGames.forEach(game => {
                const card = window.createGameCard ? window.createGameCard(game) : createGameCard(game);
                newGamesGrid.appendChild(card);
            });
        }
        // 推荐游戏模块渲染
        const recommendedGamesGrid = document.getElementById('recommendedGamesGrid');
        if (recommendedGamesGrid && games.length >= 48) {
            // 取最新48个游戏，随机挑选6个
            const latest48 = games.slice(0, 48);
            const shuffled = latest48.sort(() => Math.random() - 0.5);
            const recommended = shuffled.slice(0, 6);
            recommendedGamesGrid.innerHTML = '';
            recommended.forEach(game => {
                const card = window.createGameCard ? window.createGameCard(game) : createGameCard(game);
                recommendedGamesGrid.appendChild(card);
            });
        }
        // 驾驶类游戏模块渲染（已改为通用函数）
        renderCategoryModule('driving', 'drivingGamesGrid', 6, 3, games);
        // 射击类游戏模块渲染
        renderCategoryModule('shooting', 'shootingGamesGrid', 6, 3, games);
         // 多人游戏模块渲染
         renderCategoryModule('multiplayer', 'multiplayerGamesGrid', 6, 3, games);
        // 体育游戏模块渲染
        renderCategoryModule('sports', 'sportsGamesGrid', 6, 3, games);
        // 3D类游戏模块渲染
        renderCategoryModule('3d', '3dGamesGrid', 6, 3, games);
        // 益智类游戏模块渲染
        renderCategoryModule('puzzle', 'puzzleGamesGrid', 6, 3, games);
        // 动作类游戏模块渲染
        renderCategoryModule('action', 'actionGamesGrid', 6, 3, games);
        // 冒险类游戏模块渲染
        renderCategoryModule('adventure', 'adventureGamesGrid', 6, 3, games);
        // 策略类游戏模块渲染
        renderCategoryModule('strategy', 'strategyGamesGrid', 6, 3, games);
        // 点击类游戏模块渲染
        renderCategoryModule('clicker', 'clickerGamesGrid', 6, 3, games);
        // 女生类游戏模块渲染
        renderCategoryModule('girl', 'girlGamesGrid', 6, 3, games);
        // 街机类游戏模块渲染
        renderCategoryModule('arcade', 'arcadeGamesGrid', 6, 3, games);
        // IO类游戏模块渲染
        renderCategoryModule('io-games', 'ioGamesGrid', 6, 3, games);
        
        console.log('Game application initialized successfully!');
    }).catch(error => {
        console.error('Failed to initialize application:', error);
    });
}

// DOM Content Loaded event listener
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions for global access
if (typeof window !== 'undefined') {
    window.gameApp = {
        displayGames,
        filterGames,
        updatePaginationInfo
    };
}

/**
 * 通用分类模块渲染函数
 * @param {string} categoryKey 分类key（如'driving','shooting'等）
 * @param {string} gridId 容器id（如'drivingGamesGrid'）
 * @param {number} count 展示数量
 * @param {number} days 随机周期（天）
 * @param {Array} games 游戏数据
 */
// 监听语言切换，动态更新分类标题和描述
if (window.setLanguage) {
    const originSetLanguage = window.setLanguage;
    window.setLanguage = function(lang) {
        originSetLanguage(lang);
        // 检查 loadLanguage 是否返回 Promise
        let loadPromise = window.loadLanguage ? window.loadLanguage(lang) : null;
        // 新增：切换语言后隐藏下拉菜单
        var langDropdown = document.getElementById('langDropdown') || (document.querySelector && document.querySelector('#langDropdown'));
        if(langDropdown) langDropdown.classList.add('hidden');
        if (loadPromise && typeof loadPromise.then === 'function') {
            loadPromise.then(() => {
                updateCategoryTitleAndDesc();
            });
        } else {
            // 兼容原有同步逻辑
            setTimeout(() => {
                updateCategoryTitleAndDesc();
            }, 0);
        }
    };
}

function updateCategoryTitleAndDesc() {
    const urlParams = new URLSearchParams(window.location.search);
    let category = urlParams.get('category') || 'all';
    let search = urlParams.get('search') || '';
    let sort = urlParams.get('sort') || '';
    const categoryInfo = window.categoryInfo && window.categoryInfo[category];
    if (search) {
        document.getElementById('categoryTitle').textContent = search ? (window.translations && window.translations['search_result_prefix'] ? window.translations['search_result_prefix'] + '"' + search + '"' : `搜索结果为"${search}"`) : '';
        document.getElementById('categoryDescription').textContent = '';
    } else if (sort === 'newest') {
        document.getElementById('categoryTitle').textContent = window.translations && window.translations['recommended_games'] ? window.translations['recommended_games'] : 'Recommended Games';
        document.getElementById('categoryDescription').textContent = window.translations && window.translations['recommended_desc'] ? window.translations['recommended_desc'] : 'Discover the latest high-quality games recommended for you';
    } else {
        document.getElementById('categoryTitle').textContent = categoryInfo && categoryInfo.title_i18n && window.translations && window.translations[categoryInfo.title_i18n] ? window.translations[categoryInfo.title_i18n] : (categoryInfo ? categoryInfo.title : category);
        document.getElementById('categoryDescription').textContent = categoryInfo && categoryInfo.description_i18n && window.translations && window.translations[categoryInfo.description_i18n] ? window.translations[categoryInfo.description_i18n] : (categoryInfo ? categoryInfo.description : '');
    }
}
function renderCategoryModule(categoryKey, gridId, count, days, games) {
    const grid = document.getElementById(gridId);
    if (!grid || !games || games.length === 0) return;
    const storageKey = 'categoryModule_' + categoryKey;
    const now = Date.now();
    let selectedGames = [];
    let needUpdate = true;
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if (saved && Array.isArray(saved.games) && saved.timestamp) {
            if (now - saved.timestamp < days * 86400000) {
                selectedGames = saved.games;
                needUpdate = false;
            }
        }
    } catch(e) {}
    if (needUpdate) {
        const tagsArr = (window.categoryMappings && window.categoryMappings[categoryKey]) || [categoryKey];
        const pool = games.filter(game => {
            if (!game.tags) return false;
            const tags = Array.isArray(game.tags) ? game.tags : (typeof game.tags === 'string' ? game.tags.split(',') : []);
            return tags.some(tag => tagsArr.includes(tag.trim().toLowerCase()));
        });
        const shuffled = pool.sort(() => Math.random() - 0.5);
        selectedGames = shuffled.slice(0, count);
        const gamesToSave = selectedGames.map(g => ({title: g.title, image: g.image, tags: g.tags}));
        localStorage.setItem(storageKey, JSON.stringify({games: gamesToSave, timestamp: now}));
    }
    grid.innerHTML = '';
    selectedGames.forEach(game => {
        let fullGame = game;
        if (!game.embed && games && Array.isArray(games)) {
            const found = games.find(g => g.title === game.title);
            if (found) fullGame = found;
        }
        const card = window.createGameCard ? window.createGameCard(fullGame) : createGameCard(fullGame);
        grid.appendChild(card);
    });
}