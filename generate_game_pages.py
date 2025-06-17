import json
import os
import re
from urllib.parse import quote

# 读取游戏数据
with open('4.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    # 解析JSON数组
    games_data = json.loads(content)

# 创建games文件夹
os.makedirs('games', exist_ok=True)

# 生成URL友好的文件名
def generate_filename(title):
    # 移除特殊字符，转换为小写，用连字符替换空格
    filename = re.sub(r'[^a-zA-Z0-9\s]', '', title)
    filename = re.sub(r'\s+', '-', filename.strip())
    return filename.lower()

# HTML模板
html_template = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
       
    <!-- Open Graph Tags -->
    <meta property="og:title" content="{title} - Free Online Game">
    <meta property="og:description" content="{description}">
    <meta property="og:image" content="{image}">
    <meta property="og:type" content="website">
    
    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title} - Free Online Game">
    <meta name="twitter:description" content="{description}">
    <meta name="twitter:image" content="{image}">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {{
            theme: {{
                extend: {{
                    colors: {{
                        'dark-bg': '#0f0f23',
                        'dark-card': '#1a1a2e',
                        'purple-glow': '#8b5cf6',
                        'game-hover': '#16213e'
                    }},
                    animation: {{
                        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'float': 'float 6s ease-in-out infinite',
                        'glow': 'glow 2s ease-in-out infinite alternate'
                    }}
                }}
            }}
        }}
    </script>
    <style>
        @keyframes float {{
            0%, 100% {{ transform: translateY(0px) rotate(0deg); }}
            50% {{ transform: translateY(-10px) rotate(2deg); }}
        }}
        @keyframes glow {{
            from {{ box-shadow: 0 0 20px #8b5cf6; }}
            to {{ box-shadow: 0 0 30px #a855f7, 0 0 40px #8b5cf6; }}
        }}
        .gradient-bg {{
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
        }}
        .glass-effect {{
            backdrop-filter: blur(10px);
            background: rgba(139, 92, 246, 0.1);
        }}
        .game-iframe {{
            width: 100%;
            height: 600px;
            border: none;
            border-radius: 12px;
        }}
        .tag {{
            background: linear-gradient(135deg, #8b5cf6, #a855f7);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            margin: 2px;
            display: inline-block;
        }}
    </style>
</head>
<body class="gradient-bg text-white min-h-screen">
    <!-- Header -->
    <header class="glass-effect border-b border-purple-500/20 sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <!-- Logo -->
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-float">
                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                        </svg>
                    </div>
                                    </div>
                
                <!-- Back to Home Button -->
                <a href="../index.html" class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                    ← Back to Games
                </a>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <!-- Game Info Section -->
        <div class="mb-8">
            <div class="bg-dark-card/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Game Image -->
                    <div class="md:col-span-1">
                        <img src="{image}" alt="{title}" class="w-full rounded-xl shadow-lg">
                    </div>
                    
                    <!-- Game Details -->
                    <div class="md:col-span-2">
                        <h1 class="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{title}</h1>
                        
                        <p class="text-gray-300 text-lg mb-6 leading-relaxed">{description}</p>
                        
                        <!-- Tags -->
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold mb-3">Game Tags:</h3>
                            <div class="flex flex-wrap">
                                {tags_html}
                            </div>
                        </div>
                        
                        <!-- Play Button -->
                        <button onclick="startGame()" class="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-8 py-4 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 animate-glow">
                            🎮 Play Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Game Container -->
        <div id="gameContainer" class="bg-dark-card/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20" style="display: none;">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold">Now Playing: {title}</h2>
                <button onclick="closeGame()" class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors">
                    ✕ Close Game
                </button>
            </div>
            <iframe id="gameFrame" class="game-iframe" src="" allowfullscreen></iframe>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-dark-card/30 border-t border-purple-500/20 py-8 mt-16">
        <div class="container mx-auto px-4 text-center">
            <p class="text-gray-400">
                © 2025 NeoOasis. All rights reserved. | 
                <a href="../index.html" class="text-purple-400 hover:text-purple-300">More Free Games</a>
            </p>
        </div>
    </footer>

    <script>
        function startGame() {{
            const gameContainer = document.getElementById('gameContainer');
            const gameFrame = document.getElementById('gameFrame');
            
            gameFrame.src = '{embed}';
            gameContainer.style.display = 'block';
            gameContainer.scrollIntoView({{ behavior: 'smooth' }});
        }}
        
        function closeGame() {{
            const gameContainer = document.getElementById('gameContainer');
            const gameFrame = document.getElementById('gameFrame');
            
            gameFrame.src = '';
            gameContainer.style.display = 'none';
            window.scrollTo({{ top: 0, behavior: 'smooth' }});
        }}
    </script>
</body>
</html>
'''

# 生成每个游戏的HTML页面
for i, game in enumerate(games_data):
    title = game['title']
    embed = game['embed']
    image = game['image']
    tags = game['tags']
    description = game['description']
    
    # 生成文件名
    filename = generate_filename(title)
    
    # 处理标签
    tags_list = tags.split(',')
    tags_html = ''.join([f'<span class="tag">{tag.strip()}</span>' for tag in tags_list])
    
    # 生成关键词
    keywords = f"{title}, {tags}, free online game, web game, browser game"
    
    # 填充HTML模板
    html_content = html_template.format(
        title=title,
        embed=embed,
        image=image,
        tags_html=tags_html,
        description=description,
        keywords=keywords
    )
    
    # 保存HTML文件
    file_path = f'games/{filename}.html'
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f'Generated: {file_path} for "{title}"')

print(f'\n✅ Successfully generated {len(games_data)} game pages in the games/ folder!')
print('\n📋 Generated files:')
for game in games_data:
    filename = generate_filename(game['title'])
    print(f'  - games/{filename}.html -> {game["title"]}')