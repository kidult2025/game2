// 游戏标识符生成函数
function generateGameSlug(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')  // 移除特殊字符
        .replace(/\s+/g, '-')          // 空格转连字符
        .replace(/-+/g, '-')           // 多个连字符合并为一个
        .replace(/^-|-$/g, '');        // 移除首尾连字符
}

// 生成游戏URL
function generateGameURL(title) {
    const slug = generateGameSlug(title);
    return `game-template.html?game=${encodeURIComponent(slug)}`;
}

// 为所有游戏生成URL
async function generateAllGameURLs() {
    try {
        // 加载游戏数据
        const response = await fetch('games.json');
        const games = await response.json();
        
        // 生成URL列表
        const gameURLs = games.map((game, index) => ({
            id: index + 1,
            title: game.title,
            slug: generateGameSlug(game.title),
            url: generateGameURL(game.title),
            fullURL: `${window.location.origin}/${generateGameURL(game.title)}`
        }));
        
        return gameURLs;
    } catch (error) {
        console.error('生成游戏URL时出错:', error);
        return [];
    }
}

// 使用示例
generateAllGameURLs().then(urls => {
    console.log('所有游戏URL:', urls);
    
    // 输出为表格格式
    console.table(urls);
    
    // 输出为JSON格式
    console.log('JSON格式:', JSON.stringify(urls, null, 2));
});