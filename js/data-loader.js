// 数据加载和处理模块

// 格式化数字为模糊显示
function formatFuzzyNumber(num) {
    if (num < 10) return num.toString();
    if (num < 100) {
        const tens = Math.floor(num / 10) * 10;
        return tens + '+';
    }
    if (num < 1000) {
        const hundreds = Math.floor(num / 100) * 100;
        return hundreds + '+';
    }
    const thousands = Math.floor(num / 1000) * 1000;
    return thousands + '+';
}

// 分类映射
const categoryMappings = {
    driving: ['car', 'driving', 'racing', 'drift', 'truck', 'speed'],
    shooting: ['shooting', 'gun', 'weapon', 'first-person-shooter', 'sniper', 'battle'],
    puzzle: ['puzzle', 'logic', 'brain', 'solitaire', 'card'],
    multiplayer: ['multiplayer', 'io-games', 'battle-royale', '2-player'],
    sports: ['sports', 'basketball', 'football', 'soccer', 'ball'],
    casual: ['clicker', 'idle', 'casual', 'fun', 'cute', 'mobile'],
    arcade: ['arcade', 'retro', 'classic', '2d'],
    simulation: ['simulator', 'farming', 'cooking', 'tycoon'],
    action: ['action', 'fighting', 'combat', 'adventure', 'platform', 'beat-em-up'],
    adventure: ['adventure', 'exploration', 'quest', 'story', 'rpg'],
    strategy: ['strategy', 'tactical', 'tower-defense', 'rts', 'turn-based'],
    rpg: ['rpg', 'role-playing', 'fantasy', 'magic', 'character'],
    clicker: ['clicker', 'idle', 'incremental', 'tap'],
    kids: ['kids', 'children', 'educational', 'family', 'cute'],
    girl: ['girl', 'fashion', 'dress-up', 'makeup', 'princess'],
    horror: ['horror', 'scary', 'zombie', 'survival', 'dark'],
    'io-games': ['io-games', 'multiplayer', 'online', 'competitive'],
    '3d': ['3d', 'three-dimensional', 'realistic'],
    mobile: ['mobile', 'touch', 'smartphone', 'tablet']
};

// 分类信息
const categoryInfo = {
    all: { title: ' Update', description: 'Discover the most entertaining online games, play instantly without downloads', title_i18n: 'update', description_i18n: 'update_desc' },
    Recommended : { title: ' Recommended Games', description: 'Discover the latest high-quality games recommended for you', title_i18n: 'recommended_games', description_i18n: 'recommended_games_desc' },
    driving: { title: ' Driving Games', description: 'Experience the thrill of high-speed racing and various driving challenges', title_i18n: 'driving_games', description_i18n: 'driving_games_desc' },
    shooting: { title: 'Shooting Games', description: 'Intense shooting battles that test your reflexes and aiming skills', title_i18n: 'shooting_games', description_i18n: 'shooting_games_desc' },
    puzzle: { title: ' Puzzle Games', description: 'Brain-training challenges and enjoy the fun of solving puzzles', title_i18n: 'puzzle_games', description_i18n: 'puzzle_games_desc' },
    multiplayer: { title: ' Multiplayer Games', description: 'Compete with players worldwide and experience multiplayer excitement', title_i18n: 'multiplayer_games', description_i18n: 'multiplayer_games_desc' },
    sports: { title: ' Sports Games', description: 'Various sports simulations to feel the charm of athletics', title_i18n: 'sports_games', description_i18n: 'sports_games_desc' },
    casual: { title: ' Casual Games', description: 'Relaxing gaming experience, unwind anytime, anywhere', title_i18n: 'casual_games', description_i18n: 'casual_games_desc' },
    arcade: { title: ' Arcade Games', description: 'Classic arcade games reborn, relive childhood memories', title_i18n: 'arcade_games', description_i18n: 'arcade_games_desc' },
    simulator: { title: ' Simulator Games', description: 'Realistic simulations of various activities and scenarios', title_i18n: 'simulator_games', description_i18n: 'simulator_games_desc' },
    action: { title: ' Action Games', description: 'Fast-paced action games with exciting combat and challenges', title_i18n: 'action_games', description_i18n: 'action_games_desc' },
    adventure: { title: ' Adventure Games', description: 'Embark on epic journeys and explore mysterious worlds', title_i18n: 'adventure_games', description_i18n: 'adventure_games_desc' },
    strategy: { title: ' Strategy Games', description: 'Test your tactical thinking and strategic planning skills', title_i18n: 'strategy_games', description_i18n: 'strategy_games_desc' },
    rpg: { title: ' RPG Games', description: 'Role-playing adventures with character development and storytelling', title_i18n: 'rpg_games', description_i18n: 'rpg_games_desc' },
    clicker: { title: ' Clicker Games', description: 'Simple yet addictive clicking and idle gameplay', title_i18n: 'clicker_games', description_i18n: 'clicker_games_desc' },
    kids: { title: ' Kids Games', description: 'Safe and educational games designed for children', title_i18n: 'kids_games', description_i18n: 'kids_games_desc' },
    girl: { title: ' Girl Games', description: 'Fashion, dress-up, and lifestyle games for girls', title_i18n: 'girl_games', description_i18n: 'girl_games_desc' },
    horror: { title: ' Horror Games', description: 'Spine-chilling horror experiences and survival challenges', title_i18n: 'horror_games', description_i18n: 'horror_games_desc' },
    'io-games': { title: ' IO Games', description: 'Competitive online multiplayer games', title_i18n: 'io_games', description_i18n: 'io_games_desc' },
    '3d': { title: ' 3D Games', description: 'Immersive three-dimensional gaming experiences', title_i18n: '3d_games', description_i18n: '3d_games_desc' },
    mobile: { title: ' Mobile Games', description: 'Games optimized for mobile devices and touch controls', title_i18n: 'mobile_games', description_i18n: 'mobile_games_desc' }
};

// 加载游戏数据
async function loadGamesData() {
    try {
        const response = await fetch('games.json');
        const text = await response.text();
        return JSON.parse(text);
    } catch (error) {
        console.error('Error loading games data:', error);
        throw error;
    }
}

if (typeof window !== 'undefined') {
    window.loadGamesData = loadGamesData;
    window.categoryMappings = categoryMappings;
    window.categoryInfo = categoryInfo;
    // 分类按钮数据（含图标）
    window.categoryList = [
        { name: 'Home', icon: '🏡', dataCategory: 'home' },
        { name: 'Update', icon: '✨', dataCategory: 'all' },
        { name: 'Recommended', icon: '🔥', dataCategory: 'Recommended' },
        { name: 'Driving', icon: '🚗', dataCategory: 'driving' },
        { name: 'Shooting', icon: '🔫', dataCategory: 'shooting' },
        { name: 'Multiplayer', icon: '🧑‍🤝‍🧑', dataCategory: 'multiplayer' },
        { name: 'Sports', icon: '🏀', dataCategory: 'sports' },
        { name: 'Puzzle', icon: '🧩', dataCategory: 'puzzle' },
        { name: 'Arcade', icon: '🕹️', dataCategory: 'arcade' },
        { name: 'Action', icon: '⚔️', dataCategory: 'action' },
        { name: 'Adventure', icon: '🗺️', dataCategory: 'adventure' },
        { name: 'Strategy', icon: '🧠', dataCategory: 'strategy' },
        { name: 'Simulator', icon: '🏗️', dataCategory: 'simulator' },
        { name: 'RPG', icon: '🐉', dataCategory: 'rpg' },
        { name: 'Clicker', icon: '👆', dataCategory: 'clicker' },
        { name: 'Kids', icon: '👶', dataCategory: 'kids' },
        { name: 'Girl', icon: '👧', dataCategory: 'girl' },
        { name: 'Horror', icon: '👻', dataCategory: 'horror' },
        { name: 'IO Games', icon: '🌐', dataCategory: 'io-games' },
        { name: '3D', icon: '🎯', dataCategory: '3d' },
        { name: 'Mobile', icon: '📱', dataCategory: 'mobile' }
    ];
}
// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatFuzzyNumber,
        categoryMappings,
        categoryInfo,
        loadGamesData
    };
}