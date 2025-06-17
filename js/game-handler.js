// 游戏卡片和处理模块

// 根据标签获取游戏图标
function getGameIcon(tags) {
    const tagLower = tags.toLowerCase();
    if (tagLower.includes('car') || tagLower.includes('driving')) return '🚗';
    if (tagLower.includes('gun') || tagLower.includes('shooting')) return '🔫';
    if (tagLower.includes('puzzle') || tagLower.includes('brain')) return '🧩';
    if (tagLower.includes('sport') || tagLower.includes('ball')) return '⚽';
    if (tagLower.includes('monster') || tagLower.includes('zombie')) return '👹';
    if (tagLower.includes('airplane') || tagLower.includes('flying')) return '✈️';
    if (tagLower.includes('cooking') || tagLower.includes('food')) return '🍳';
    if (tagLower.includes('animal') || tagLower.includes('pet')) return '🐾';
    return '🎮';
}

// 创建游戏卡片
function createGameCard(game) {
    const icon = getGameIcon(game.tags);
    const card = document.createElement('div');
    card.className = 'fade-in';
    
    card.innerHTML = `
        <div class="relative group cursor-pointer game-card bg-dark-card rounded-lg overflow-hidden border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300" data-title="${game.title}">
            <img src="${game.image}" alt="${game.title}" class="w-full h-48 object-cover" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <div class="w-full h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center" style="display: none;">
                <span class="text-6xl animate-float">${icon}</span>
            </div>
            <div class="absolute top-2 left-2">
                <!-- 删除免费标签 -->
            </div>
            <!-- 悬停时在底部显示黑色渐变背景和游戏标题 -->
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div class="p-3 pt-8">
                    <span class="text-white text-sm font-medium block truncate">${game.title}</span>
                </div>
            </div>
        </div>
    `;
    
    // 添加点击事件监听器 - 跳转到独立游戏页面
    const gameDiv = card.querySelector('.relative.group');
    gameDiv.addEventListener('click', function() {
        const title = this.dataset.title;
        // 将游戏标题转换为URL友好的格式
        const gameSlug = title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // 移除特殊字符
            .replace(/\s+/g, '-') // 将空格替换为连字符
            .replace(/-+/g, '-') // 合并多个连字符
            .replace(/^-|-$/g, ''); // 移除开头和结尾的连字符
        
        // 跳转到游戏页面
        window.location.href = `game-template.html?game=${gameSlug}`;
    });
    
    return card;
}

// 加载相似游戏推荐
function loadSimilarGames(currentGameTags, currentGameTitle, allGames) {
    const similarGamesContainer = document.getElementById('similarGamesGrid');
    const loadingDiv = document.getElementById('similarGamesLoading');
    if (loadingDiv) loadingDiv.style.display = 'none';
    const currentTags = currentGameTags.toLowerCase().split(',').map(tag => tag.trim());

    // 1. 计算所有游戏与当前游戏标签的重合度
    let overlapList = allGames.filter(game => game.title !== currentGameTitle).map(game => {
        const gameTags = game.tags.toLowerCase().split(',').map(tag => tag.trim());
        const sameCount = currentTags.filter(tag => gameTags.includes(tag)).length;
        return { game, sameCount };
    });
    // 2. 按重合度从高到低排序，筛选重合度大于0的游戏
    let similarGames = overlapList.filter(item => item.sameCount > 0)
        .sort((a, b) => b.sameCount - a.sameCount)
        .map(item => item.game)
        .slice(0, 10);
    // 3. 如果不足10个，补充至少有3个相同标签但未被选中的游戏
    if (similarGames.length < 10) {
        const extraGames = overlapList.filter(item => {
            return item.sameCount >= 3 && !similarGames.some(g => g.title === item.game.title);
        }).map(item => item.game);
        similarGames = similarGames.concat(extraGames).slice(0, 10);
    }
    // 4. 如果依然没有任何标签相同的游戏，则随机推荐
    if (similarGames.length === 0) {
        const randomGames = allGames.filter(game => game.title !== currentGameTitle)
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
        similarGamesContainer.innerHTML = randomGames.map(game => {
            const icon = getGameIcon(game.tags);
            return `
                <div class="relative group cursor-pointer" onclick="redirectToGame('${game.title}')">
                    <div class="bg-dark-card rounded-lg overflow-hidden border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
                        <div class="relative h-20 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <img src="${game.image}" alt="${game.title}" class="w-full h-full object-cover" 
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                            <div class="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center absolute inset-0" style="display: none;">
                                <span class="text-2xl">${icon}</span>
                            </div>
                        </div>
                        <div class="p-2">
                            <h4 class="text-xs font-medium text-white truncate leading-tight">${game.title}</h4>
                            <p class="text-xs text-gray-400 truncate mt-0.5">${game.tags.split(',')[0].trim()}</p>
                        </div>
                        <div class="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </div>
                </div>
            `;
        }).join('');
        return;
    }
    // 5. 生成推荐游戏HTML
    similarGamesContainer.innerHTML = similarGames.map(game => {
        const icon = getGameIcon(game.tags);
        return `
            <div class="relative group cursor-pointer" onclick="redirectToGame('${game.title}')">
                <div class="bg-dark-card rounded-lg overflow-hidden border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
                    <div class="relative h-24 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <img src="${game.image}" alt="${game.title}" class="w-full h-full object-cover" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                        <div class="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center absolute inset-0" style="display: none;">
                            <span class="text-2xl">${icon}</span>
                        </div>
                        <div class="absolute bottom-1 left-1 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h4 class="text-xs font-medium text-white truncate leading-tight max-w-20">${game.title}</h4>
                        </div>
                    </div>
                    <div class="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </div>
            </div>
        `;
    }).join('');
    
    // 如果没有找到同类游戏，显示随机推荐
    if (similarGames.length === 0) {
        const randomGames = allGames.filter(game => game.title !== currentGameTitle)
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
        
        similarGamesContainer.innerHTML = randomGames.map(game => {
            const icon = getGameIcon(game.tags);
            return `
                <div class="relative group cursor-pointer" onclick="redirectToGame('${game.title}')">
                    <div class="bg-dark-card rounded-lg overflow-hidden border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
                        <div class="relative h-20 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <img src="${game.image}" alt="${game.title}" class="w-full h-full object-cover" 
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                            <div class="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center absolute inset-0" style="display: none;">
                                <span class="text-2xl">${icon}</span>
                            </div>
                        </div>
                        <div class="p-2">
                            <h4 class="text-xs font-medium text-white truncate leading-tight">${game.title}</h4>
                            <p class="text-xs text-gray-400 truncate mt-0.5">${game.tags.split(',')[0].trim()}</p>
                        </div>
                        <div class="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// 跳转到游戏页面的辅助函数
function redirectToGame(title) {
    const gameSlug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    window.location.href = `game-template.html?game=${gameSlug}`;
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getGameIcon,
        createGameCard,
        loadSimilarGames,
        redirectToGame
    };
}
// 兼容浏览器环境
if (typeof window !== 'undefined') {
    window.loadSimilarGames = loadSimilarGames;
    window.redirectToGame = redirectToGame;
}