/**
 * Hoxta Game Servers Data
 * Used by game.php to display individual game pages
 */

const gamesData = {
    minecraft: {
        id: 'minecraft',
        slug: 'minecraft',
        title: 'Minecraft',
        coverImage: '/assets/img/games/minecraft-cover.jpg',
        pricingDisplay: '$0.50/GB',
        priceValue: 0.50,
        pricingUnit: 'GB',
        shortDescription: 'Java & Bedrock Edition servers',
        fullDescription: 'Host your perfect Minecraft world with our premium server hosting. Whether you\'re running a small survival server for friends or a massive network with thousands of players, we have the resources and expertise to keep your world running smoothly.',
        tags: ['Mods', 'Plugins', 'DDoS Protection', 'Instant Setup'],
        category: 'sandbox',
        popular: true,
        badge: 'BESTSELLER',
        heroPoints: [
            'One-click modpack installation',
            'Java & Bedrock crossplay support',
            'Unlimited player slots available',
            'Free MySQL database included'
        ],
        features: [
            'Full FTP & SFTP access',
            'One-click modpack installer',
            'Bukkit, Spigot, Paper support',
            'Automatic backups',
            'Custom JAR support',
            'Sub-user management',
            'Scheduled tasks',
            'Console access 24/7'
        ],
        plans: [
            { name: 'Starter', ram: '2GB', storage: '10GB NVMe', price: 3.00, features: ['Up to 10 players', 'Basic mod support', 'Daily backups'] },
            { name: 'Standard', ram: '4GB', storage: '25GB NVMe', price: 6.00, popular: true, features: ['Up to 30 players', 'Full mod support', 'Hourly backups', 'Free subdomain'] },
            { name: 'Premium', ram: '8GB', storage: '50GB NVMe', price: 12.00, features: ['Up to 100 players', 'Priority support', 'Custom domain', 'MySQL database'] },
            { name: 'Enterprise', ram: '16GB', storage: '100GB NVMe', price: 24.00, features: ['Unlimited players', 'Dedicated resources', 'Premium support', 'All features included'] }
        ],
        faqs: [
            { question: 'Can I install modpacks like FTB or Tekkit?', answer: 'Yes! Our one-click installer supports all major modpacks including Feed The Beast, Tekkit, SkyFactory, All The Mods, and hundreds more. You can also upload custom modpacks via FTP.' },
            { question: 'Do you support both Java and Bedrock?', answer: 'Absolutely! We support Java Edition, Bedrock Edition, and even crossplay between both using GeyserMC. This is included free with all plans.' },
            { question: 'Can I upgrade my RAM later?', answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes are applied instantly without losing any data.' },
            { question: 'How many plugins can I install?', answer: 'There\'s no limit on plugins! Install as many Bukkit, Spigot, or Paper plugins as your server can handle.' },
            { question: 'Do you offer DDoS protection?', answer: 'Yes, enterprise-grade DDoS protection is included free with all Minecraft server plans.' }
        ]
    },
    fivem: {
        id: 'fivem',
        slug: 'fivem',
        title: 'FiveM',
        coverImage: '/assets/img/games/fivem-cover.jpg',
        pricingDisplay: '$1.40/slot',
        priceValue: 1.40,
        pricingUnit: 'slot',
        shortDescription: 'GTA V roleplay servers',
        fullDescription: 'Launch your own GTA V roleplay community with our high-performance FiveM servers. We provide the resources and stability needed for complex RP frameworks like ESX, QBCore, and custom scripts.',
        tags: ['Roleplay', 'Custom Scripts', 'High Performance', 'ESX/QBCore'],
        category: 'roleplay',
        popular: true,
        badge: 'POPULAR',
        heroPoints: [
            'Pre-installed ESX & QBCore frameworks',
            'OneSync Infinity support',
            'Custom resource installation',
            'txAdmin control panel included'
        ],
        features: [
            'txAdmin panel included',
            'OneSync Infinity support',
            'Pre-configured frameworks',
            'Custom resource support',
            'MySQL database included',
            'Automatic restarts',
            'Full root access',
            'Discord integration'
        ],
        plans: [
            { name: 'Starter', slots: 32, cpu: '2 vCores', ram: '4GB', storage: '30GB NVMe', price: 19.00, features: ['32 player slots', 'Basic scripts', 'Daily backups'] },
            { name: 'Standard', slots: 64, cpu: '4 vCores', ram: '8GB', storage: '60GB NVMe', price: 35.00, popular: true, features: ['64 player slots', 'ESX/QBCore ready', 'Hourly backups', 'Priority support'] },
            { name: 'Premium', slots: 128, cpu: '6 vCores', ram: '16GB', storage: '120GB NVMe', price: 65.00, features: ['128 player slots', 'Full framework support', 'Custom scripts', 'Dedicated resources'] },
            { name: 'Enterprise', slots: 'Unlimited', cpu: '8 vCores', ram: '32GB', storage: '250GB NVMe', price: 120.00, features: ['Unlimited slots', 'Maximum performance', '24/7 priority support', 'Custom configurations'] }
        ],
        faqs: [
            { question: 'Which RP frameworks do you support?', answer: 'We support all major frameworks including ESX, QBCore, vRP, and custom frameworks. Many come pre-installed for easy setup.' },
            { question: 'Can I use OneSync Infinity?', answer: 'Yes! All our FiveM servers support OneSync Infinity for high player counts with no additional fees.' },
            { question: 'Do you include txAdmin?', answer: 'Absolutely. txAdmin comes pre-installed on all FiveM servers for easy server management, player monitoring, and automated restarts.' },
            { question: 'Can I install custom scripts and MLOs?', answer: 'Yes, you have full access to install any custom resources, scripts, vehicles, and MLOs via FTP or our file manager.' }
        ]
    },
    cs2: {
        id: 'cs2',
        slug: 'cs2',
        title: 'Counter-Strike 2',
        coverImage: '/assets/img/games/cs2-cover.jpg',
        pricingDisplay: '$0.80/slot',
        priceValue: 0.80,
        pricingUnit: 'slot',
        shortDescription: 'Competitive CS2 servers',
        fullDescription: 'Host competitive Counter-Strike 2 servers with premium 128-tick performance. Perfect for scrims, leagues, community servers, and custom game modes.',
        tags: ['Competitive', '128 Tick', 'Low Latency', 'Custom Maps'],
        category: 'fps',
        popular: true,
        badge: 'HOT',
        heroPoints: [
            '128-tick servers by default',
            'Workshop map support',
            'Custom game mode configs',
            'Anti-cheat integration ready'
        ],
        features: [
            '128-tick performance',
            'Steam Workshop integration',
            'RCON access',
            'Custom configurations',
            'SourceMod support',
            'Match recording',
            'Automatic updates',
            'Low-latency network'
        ],
        plans: [
            { name: '5v5 Scrim', slots: 12, cpu: '2 vCores', storage: '20GB NVMe', price: 8.00, features: ['12 slots', '128-tick', 'Perfect for scrims'] },
            { name: 'Community', slots: 24, cpu: '3 vCores', storage: '40GB NVMe', price: 15.00, popular: true, features: ['24 slots', 'Workshop maps', 'SourceMod ready'] },
            { name: 'League', slots: 32, cpu: '4 vCores', storage: '60GB NVMe', price: 22.00, features: ['32 slots', 'Match recording', 'Priority support'] },
            { name: 'Tournament', slots: 64, cpu: '6 vCores', storage: '100GB NVMe', price: 40.00, features: ['64 slots', 'Multiple servers', 'Dedicated resources', 'Custom configs'] }
        ],
        faqs: [
            { question: 'Are your servers 128-tick?', answer: 'Yes! All our CS2 servers run at 128-tick by default for the best competitive experience.' },
            { question: 'Can I install custom maps from the Workshop?', answer: 'Absolutely. Steam Workshop integration is included, making it easy to add any custom map.' },
            { question: 'Do you support SourceMod and plugins?', answer: 'Yes, SourceMod and MetaMod are fully supported for custom plugins and server modifications.' }
        ]
    },
    rust: {
        id: 'rust',
        slug: 'rust',
        title: 'Rust',
        coverImage: '/assets/img/games/rust-cover.jpg',
        pricingDisplay: '$1.00/slot',
        priceValue: 1.00,
        pricingUnit: 'slot',
        shortDescription: 'Survival game servers',
        fullDescription: 'Build, raid, and survive on your own Rust server. Our high-performance hosting handles the demanding resource requirements of Rust, even with large maps and high player counts.',
        tags: ['Survival', 'Oxide/uMod', 'Custom Maps', 'High Performance'],
        category: 'survival',
        popular: true,
        badge: 'POPULAR',
        heroPoints: [
            'Oxide/uMod pre-installed',
            'Custom map support',
            'Automatic wipe scheduling',
            'RustEdit compatible'
        ],
        features: [
            'Oxide/uMod support',
            'Custom map uploads',
            'Automatic wipe scheduler',
            'RCON access',
            'Plugin marketplace',
            'Automatic updates',
            'Backup management',
            'Performance monitoring'
        ],
        plans: [
            { name: 'Starter', slots: 50, cpu: '3 vCores', ram: '6GB', storage: '50GB NVMe', price: 20.00, features: ['50 slots', '3500 map size', 'Basic plugins'] },
            { name: 'Standard', slots: 100, cpu: '4 vCores', ram: '10GB', storage: '80GB NVMe', price: 35.00, popular: true, features: ['100 slots', '4500 map size', 'Full plugin support', 'Wipe scheduler'] },
            { name: 'Premium', slots: 200, cpu: '6 vCores', ram: '16GB', storage: '150GB NVMe', price: 60.00, features: ['200 slots', 'Custom maps', 'Priority support', 'All features'] },
            { name: 'Enterprise', slots: 500, cpu: '8 vCores', ram: '32GB', storage: '300GB NVMe', price: 100.00, features: ['500 slots', 'Maximum performance', 'Dedicated resources', 'Custom configurations'] }
        ],
        faqs: [
            { question: 'Can I install Oxide plugins?', answer: 'Yes! Oxide/uMod comes pre-installed and you can install plugins directly from our control panel or manually via FTP.' },
            { question: 'Do you support custom maps?', answer: 'Absolutely. You can upload custom procedural or RustEdit maps via FTP. We support all map sizes.' },
            { question: 'How do wipes work?', answer: 'You can schedule automatic wipes through our control panel or perform manual wipes. We offer forced wipe synchronization with official Rust updates.' }
        ]
    },
    palworld: {
        id: 'palworld',
        slug: 'palworld',
        title: 'Palworld',
        coverImage: '/assets/img/games/palworld-cover.jpg',
        pricingDisplay: '$0.75/slot',
        priceValue: 0.75,
        pricingUnit: 'slot',
        shortDescription: 'Monster-catching survival',
        fullDescription: 'Catch Pals and build your base in Palworld. Our optimized servers provide the performance needed for this demanding survival game with friends.',
        tags: ['Survival', 'Co-op', 'Mods', 'New'],
        category: 'survival',
        popular: true,
        badge: 'NEW',
        heroPoints: [
            'Optimized for Palworld performance',
            'Easy save management',
            'Mod support available',
            'Crossplay ready'
        ],
        features: [
            'Optimized configurations',
            'Easy world management',
            'Automatic backups',
            'Mod support',
            'Discord integration',
            'Performance monitoring',
            'Scheduled restarts',
            '24/7 uptime'
        ],
        plans: [
            { name: 'Starter', slots: 8, ram: '8GB', storage: '30GB NVMe', price: 12.00, features: ['8 players', 'Perfect for friends', 'Daily backups'] },
            { name: 'Standard', slots: 16, ram: '12GB', storage: '50GB NVMe', price: 20.00, popular: true, features: ['16 players', 'Mod support', 'Hourly backups'] },
            { name: 'Premium', slots: 32, ram: '16GB', storage: '80GB NVMe', price: 35.00, features: ['32 players', 'Priority support', 'All features'] }
        ],
        faqs: [
            { question: 'Can I use mods on my Palworld server?', answer: 'Yes! We support Palworld mods. You can upload and manage them through our control panel.' },
            { question: 'How many players can join?', answer: 'Our plans support up to 32 players. For larger communities, contact us for custom solutions.' },
            { question: 'Is crossplay supported?', answer: 'Yes, our servers are configured for crossplay between Steam and Xbox players.' }
        ]
    },
    valheim: {
        id: 'valheim',
        slug: 'valheim',
        title: 'Valheim',
        coverImage: '/assets/img/games/valheim-cover.jpg',
        pricingDisplay: '$0.60/slot',
        priceValue: 0.60,
        pricingUnit: 'slot',
        shortDescription: 'Viking survival servers',
        fullDescription: 'Explore, build, and conquer in your own Viking world. Our Valheim servers provide the perfect foundation for your clan\'s adventures.',
        tags: ['Survival', 'Co-op', 'Mods', 'BepInEx'],
        category: 'survival',
        popular: true,
        heroPoints: [
            'Valheim Plus support',
            'BepInEx mod framework',
            'World file management',
            'Crossplay enabled'
        ],
        features: [
            'Valheim Plus support',
            'BepInEx mods',
            'World backup/restore',
            'Password protection',
            'Automatic updates',
            'Discord integration',
            'Performance tuning',
            'Custom configurations'
        ],
        plans: [
            { name: 'Starter', slots: 4, ram: '4GB', storage: '10GB NVMe', price: 5.00, features: ['4 players', 'Perfect for co-op', 'Daily backups'] },
            { name: 'Standard', slots: 10, ram: '6GB', storage: '20GB NVMe', price: 10.00, popular: true, features: ['10 players', 'Mod support', 'Hourly backups'] },
            { name: 'Premium', slots: 20, ram: '8GB', storage: '40GB NVMe', price: 18.00, features: ['20 players', 'Priority support', 'All mods'] }
        ],
        faqs: [
            { question: 'Can I use Valheim Plus?', answer: 'Yes! Valheim Plus is fully supported and can be installed with one click from our control panel.' },
            { question: 'How do I transfer my world?', answer: 'Simply upload your world files via FTP or our file manager. We provide easy instructions for the process.' }
        ]
    },
    // ============================================
    // NEW GAMES
    // ============================================
    metin2: {
        id: 'metin2',
        slug: 'metin2',
        title: 'Metin2',
        coverImage: '/assets/img/games/metin2-cover.jpg',
        pricingDisplay: '$0.40/slot',
        priceValue: 0.40,
        pricingUnit: 'slot',
        shortDescription: 'Classic MMORPG private servers',
        fullDescription: 'Host your own Metin2 private server with our optimized hosting. Perfect for custom content, unique events, and building your own MMORPG community.',
        tags: ['MMORPG', 'Private Server', 'Custom Content', 'PvP'],
        category: 'mmo',
        popular: false,
        heroPoints: [
            'Pre-configured server files',
            'MySQL database included',
            'Custom content support',
            'DDoS protection included'
        ],
        features: [
            'Full database access',
            'Custom client support',
            'Event scheduler',
            'Admin tools included',
            'Automatic backups',
            'MySQL optimization',
            'Low-latency network',
            '24/7 uptime'
        ],
        plans: [
            { name: 'Starter', slots: 100, ram: '4GB', storage: '40GB NVMe', price: 15.00, features: ['100 players', 'Basic setup', 'Daily backups'] },
            { name: 'Standard', slots: 300, ram: '8GB', storage: '80GB NVMe', price: 30.00, popular: true, features: ['300 players', 'Full customization', 'Hourly backups'] },
            { name: 'Premium', slots: 500, ram: '16GB', storage: '150GB NVMe', price: 55.00, features: ['500 players', 'Priority support', 'All features'] },
            { name: 'Enterprise', slots: 1000, ram: '32GB', storage: '300GB NVMe', price: 95.00, features: ['1000+ players', 'Dedicated resources', 'Custom configs'] }
        ],
        faqs: [
            { question: 'Can I use my own server files?', answer: 'Yes! You can upload your own Metin2 server files or use our pre-configured templates.' },
            { question: 'Is a database included?', answer: 'Absolutely. Every Metin2 server includes a MySQL database with phpMyAdmin access.' },
            { question: 'Do you support custom clients?', answer: 'Yes, we support all custom clients and content modifications.' }
        ]
    },
    cs16: {
        id: 'cs16',
        slug: 'cs16',
        title: 'Counter-Strike 1.6',
        coverImage: '/assets/img/games/cs16-cover.jpg',
        pricingDisplay: '$0.30/slot',
        priceValue: 0.30,
        pricingUnit: 'slot',
        shortDescription: 'Classic CS 1.6 servers',
        fullDescription: 'Keep the legend alive with Counter-Strike 1.6 servers. Perfect for nostalgic gameplay, public servers, and competitive matches.',
        tags: ['Classic', 'FPS', 'Competitive', 'Mods'],
        category: 'fps',
        popular: false,
        heroPoints: [
            'AMX Mod X support',
            'Anti-cheat ready',
            'Custom maps & skins',
            'Low ping guaranteed'
        ],
        features: [
            'AMX Mod X pre-installed',
            'Custom map support',
            'HLTV broadcasting',
            'Anti-cheat integration',
            'RCON access',
            'Automatic restarts',
            'FastDL included',
            'Low-latency network'
        ],
        plans: [
            { name: 'Public', slots: 16, storage: '10GB NVMe', price: 4.00, features: ['16 slots', 'AMX Mod X', 'FastDL'] },
            { name: 'Community', slots: 24, storage: '15GB NVMe', price: 6.00, popular: true, features: ['24 slots', 'Custom mods', 'HLTV ready'] },
            { name: 'Competitive', slots: 32, storage: '20GB NVMe', price: 9.00, features: ['32 slots', 'Anti-cheat', 'Priority support'] }
        ],
        faqs: [
            { question: 'Do you support AMX Mod X?', answer: 'Yes! AMX Mod X comes pre-installed with popular plugins ready to use.' },
            { question: 'Can I add custom maps and skins?', answer: 'Absolutely. Upload custom content via FTP and use FastDL for quick downloads.' },
            { question: 'Is HLTV supported?', answer: 'Yes, you can enable HLTV for match broadcasting and demo recording.' }
        ]
    },
    'farming-simulator-25': {
        id: 'farmingsim25',
        slug: 'farming-simulator-25',
        title: 'Farming Simulator 25',
        coverImage: '/assets/img/games/farmingsim25-cover.jpg',
        pricingDisplay: '$0.70/slot',
        priceValue: 0.70,
        pricingUnit: 'slot',
        shortDescription: 'Multiplayer farming servers',
        fullDescription: 'Build your farming empire together. Host dedicated Farming Simulator 25 servers for seamless multiplayer farming with friends and community.',
        tags: ['Simulation', 'Multiplayer', 'Mods', 'Co-op'],
        category: 'other',
        popular: true,
        badge: 'NEW',
        heroPoints: [
            'Mod support included',
            'Save game management',
            'Easy configuration',
            'Crossplay compatible'
        ],
        features: [
            'Full mod support',
            'Save file management',
            'Server configuration GUI',
            'Automatic updates',
            'Password protection',
            'Admin controls',
            'Backup management',
            '24/7 uptime'
        ],
        plans: [
            { name: 'Farm', slots: 8, ram: '4GB', storage: '30GB NVMe', price: 10.00, features: ['8 players', 'Mods supported', 'Daily backups'] },
            { name: 'Ranch', slots: 16, ram: '8GB', storage: '60GB NVMe', price: 18.00, popular: true, features: ['16 players', 'Full mod support', 'Hourly backups'] },
            { name: 'Estate', slots: 32, ram: '16GB', storage: '120GB NVMe', price: 35.00, features: ['32 players', 'Priority support', 'All features'] }
        ],
        faqs: [
            { question: 'Can I install mods?', answer: 'Yes! Full mod support is included. Upload mods via FTP or our file manager.' },
            { question: 'How do I transfer my save game?', answer: 'Simply upload your save files via FTP to continue your farm on our servers.' },
            { question: 'Is crossplay supported?', answer: 'Yes, our servers support crossplay between PC platforms.' }
        ]
    },
    terraria: {
        id: 'terraria',
        slug: 'terraria',
        title: 'Terraria',
        coverImage: '/assets/img/games/terraria-cover.jpg',
        pricingDisplay: '$0.35/slot',
        priceValue: 0.35,
        pricingUnit: 'slot',
        shortDescription: '2D sandbox adventure servers',
        fullDescription: 'Explore, build, and fight together in Terraria. Our dedicated servers offer smooth gameplay for your adventures with friends.',
        tags: ['Sandbox', 'Adventure', 'Co-op', 'Mods'],
        category: 'sandbox',
        popular: true,
        heroPoints: [
            'tModLoader support',
            'World management',
            'Journey Mode compatible',
            'Easy server commands'
        ],
        features: [
            'tModLoader support',
            'World file management',
            'Console commands',
            'Automatic backups',
            'Password protection',
            'Player whitelist',
            'Automatic updates',
            'Low-latency network'
        ],
        plans: [
            { name: 'Small World', slots: 8, ram: '2GB', storage: '10GB NVMe', price: 4.00, features: ['8 players', 'Any world size', 'Daily backups'] },
            { name: 'Medium World', slots: 16, ram: '4GB', storage: '20GB NVMe', price: 7.00, popular: true, features: ['16 players', 'tModLoader', 'Hourly backups'] },
            { name: 'Large World', slots: 32, ram: '8GB', storage: '40GB NVMe', price: 12.00, features: ['32 players', 'Full mod support', 'Priority support'] }
        ],
        faqs: [
            { question: 'Do you support tModLoader?', answer: 'Yes! tModLoader is fully supported for modded Terraria gameplay.' },
            { question: 'Can I upload my existing world?', answer: 'Absolutely. Upload your world files via FTP to continue your adventure.' },
            { question: 'Is Journey Mode supported?', answer: 'Yes, all game modes including Journey Mode are supported.' }
        ]
    },
    unturned: {
        id: 'unturned',
        slug: 'unturned',
        title: 'Unturned',
        coverImage: '/assets/img/games/unturned-cover.jpg',
        pricingDisplay: '$0.25/slot',
        priceValue: 0.25,
        pricingUnit: 'slot',
        shortDescription: 'Free-to-play survival servers',
        fullDescription: 'Survive the zombie apocalypse in this popular free-to-play game. Host custom Unturned servers with full mod and plugin support.',
        tags: ['Survival', 'Zombies', 'Free-to-Play', 'Mods'],
        category: 'survival',
        popular: false,
        heroPoints: [
            'Rocket mod support',
            'Custom maps',
            'Workshop integration',
            'Economy plugins'
        ],
        features: [
            'Rocket mod framework',
            'Steam Workshop mods',
            'Custom maps',
            'Economy plugins',
            'Vehicle spawns',
            'Automatic backups',
            'RCON access',
            'Low-latency network'
        ],
        plans: [
            { name: 'Starter', slots: 16, storage: '15GB NVMe', price: 4.00, features: ['16 slots', 'Rocket mods', 'Daily backups'] },
            { name: 'Standard', slots: 24, storage: '25GB NVMe', price: 6.00, popular: true, features: ['24 slots', 'Workshop maps', 'Hourly backups'] },
            { name: 'Premium', slots: 48, storage: '50GB NVMe', price: 10.00, features: ['48 slots', 'Full customization', 'Priority support'] }
        ],
        faqs: [
            { question: 'Do you support Rocket mods?', answer: 'Yes! Rocket mod framework is pre-installed with plugin support.' },
            { question: 'Can I use Workshop maps?', answer: 'Absolutely. Steam Workshop integration makes adding custom maps easy.' },
            { question: 'Are economy plugins supported?', answer: 'Yes, all popular economy and shop plugins are fully supported.' }
        ]
    },
    enshrouded: {
        id: 'enshrouded',
        slug: 'enshrouded',
        title: 'Enshrouded',
        coverImage: '/assets/img/games/enshrouded-cover.jpg',
        pricingDisplay: '$0.80/slot',
        priceValue: 0.80,
        pricingUnit: 'slot',
        shortDescription: 'Survival action RPG servers',
        fullDescription: 'Explore the mysterious lands of Enshrouded with friends. Our dedicated servers provide the performance needed for smooth co-op gameplay.',
        tags: ['Survival', 'RPG', 'Co-op', 'Building'],
        category: 'survival',
        popular: true,
        badge: 'NEW',
        heroPoints: [
            'Easy save management',
            'World configuration',
            'Automatic updates',
            'Low-latency hosting'
        ],
        features: [
            'World save management',
            'Server configuration',
            'Password protection',
            'Automatic updates',
            'Admin commands',
            'Backup management',
            'Performance tuned',
            '24/7 uptime'
        ],
        plans: [
            { name: 'Squad', slots: 8, ram: '8GB', storage: '30GB NVMe', price: 12.00, features: ['8 players', 'Easy setup', 'Daily backups'] },
            { name: 'Guild', slots: 16, ram: '16GB', storage: '60GB NVMe', price: 22.00, popular: true, features: ['16 players', 'Custom settings', 'Hourly backups'] }
        ],
        faqs: [
            { question: 'How many players can join?', answer: 'Enshrouded currently supports up to 16 players on dedicated servers.' },
            { question: 'Can I transfer my save?', answer: 'Yes! Upload your save files via FTP to continue your world on our servers.' },
            { question: 'Are updates automatic?', answer: 'Yes, we automatically update your server when new game updates are released.' }
        ]
    },
    'ark-ascended': {
        id: 'ark-ascended',
        slug: 'ark-ascended',
        title: 'ARK: Survival Ascended',
        coverImage: '/assets/img/games/ark-ascended-cover.jpg',
        pricingDisplay: '$1.50/slot',
        priceValue: 1.50,
        pricingUnit: 'slot',
        shortDescription: 'Next-gen ARK servers',
        fullDescription: 'Experience ARK like never before with Survival Ascended. Our high-performance servers handle the demanding Unreal Engine 5 requirements.',
        tags: ['Survival', 'Dinosaurs', 'Mods', 'UE5'],
        category: 'survival',
        popular: true,
        badge: 'HOT',
        heroPoints: [
            'UE5 optimized hosting',
            'Mod support via CurseForge',
            'Cluster server support',
            'Cross-platform play'
        ],
        features: [
            'Unreal Engine 5 optimized',
            'CurseForge mod support',
            'Cluster configurations',
            'Cross-platform ready',
            'Automatic updates',
            'Admin commands',
            'Backup management',
            'High-performance hardware'
        ],
        plans: [
            { name: 'Starter', slots: 20, ram: '16GB', storage: '100GB NVMe', price: 30.00, features: ['20 slots', 'Any map', 'Basic mods'] },
            { name: 'Standard', slots: 50, ram: '24GB', storage: '200GB NVMe', price: 55.00, popular: true, features: ['50 slots', 'Full mod support', 'Cluster ready'] },
            { name: 'Premium', slots: 100, ram: '32GB', storage: '400GB NVMe', price: 95.00, features: ['100 slots', 'Multiple maps', 'Priority support'] },
            { name: 'Cluster', slots: 'Unlimited', ram: '64GB+', storage: '1TB NVMe', price: 180.00, features: ['Full cluster', 'All maps', 'Dedicated resources'] }
        ],
        faqs: [
            { question: 'How much RAM do I need?', answer: 'ARK: SA is very demanding. We recommend at least 16GB RAM for small servers, 24GB+ for modded.' },
            { question: 'Are mods supported?', answer: 'Yes! We support CurseForge mods for ARK: Survival Ascended.' },
            { question: 'Can I run a cluster?', answer: 'Absolutely. We support full cluster configurations for multi-map play.' }
        ]
    },
    'among-us': {
        id: 'amongus',
        slug: 'among-us',
        title: 'Among Us',
        coverImage: '/assets/img/games/amongus-cover.jpg',
        pricingDisplay: '$0.20/slot',
        priceValue: 0.20,
        pricingUnit: 'slot',
        shortDescription: 'Private lobby hosting',
        fullDescription: 'Host private Among Us lobbies for your community. Perfect for events, streams, and playing with friends without random interruptions.',
        tags: ['Party', 'Social Deduction', 'Private', 'Mods'],
        category: 'other',
        popular: false,
        heroPoints: [
            'Private lobby hosting',
            'Custom settings',
            'Mod support available',
            'Perfect for events'
        ],
        features: [
            'Private lobbies',
            'Custom game settings',
            'Password protection',
            'Low-latency connections',
            'Event hosting',
            'Mod compatibility',
            'Easy administration',
            '24/7 availability'
        ],
        plans: [
            { name: 'Party', slots: 15, storage: '5GB NVMe', price: 3.00, features: ['15 players', 'Private lobby', 'Custom settings'] },
            { name: 'Event', slots: 30, storage: '10GB NVMe', price: 5.00, popular: true, features: ['30 players', 'Multiple lobbies', 'Mod support'] }
        ],
        faqs: [
            { question: 'How do private lobbies work?', answer: 'You get a dedicated lobby code that only your invited players can use.' },
            { question: 'Are mods like Town of Us supported?', answer: 'Yes, mod support is available for enhanced gameplay experiences.' },
            { question: 'Can I use this for streaming?', answer: 'Absolutely! Our servers are perfect for streamer events and content creation.' }
        ]
    },
    ragemp: {
        id: 'ragemp',
        slug: 'ragemp',
        title: 'RageMP',
        coverImage: '/assets/img/games/ragemp-cover.jpg',
        pricingDisplay: '$1.30/slot',
        priceValue: 1.30,
        pricingUnit: 'slot',
        shortDescription: 'GTA V multiplayer mod servers',
        fullDescription: 'Create your own GTA V multiplayer experience with RageMP. Full scripting support for roleplay, racing, and custom game modes.',
        tags: ['GTA V', 'Roleplay', 'Multiplayer', 'Custom Scripts'],
        category: 'roleplay',
        popular: false,
        heroPoints: [
            'C# and JavaScript scripting',
            'High player capacity',
            'Custom game modes',
            'Voice chat support'
        ],
        features: [
            'C#/JS scripting',
            'MySQL database',
            'Voice chat ready',
            'Custom game modes',
            'High performance',
            'Automatic backups',
            'Full control panel',
            'DDoS protection'
        ],
        plans: [
            { name: 'Starter', slots: 50, cpu: '2 vCores', ram: '4GB', storage: '30GB NVMe', price: 25.00, features: ['50 slots', 'Basic scripts', 'Daily backups'] },
            { name: 'Standard', slots: 100, cpu: '4 vCores', ram: '8GB', storage: '60GB NVMe', price: 45.00, popular: true, features: ['100 slots', 'Full scripting', 'Hourly backups'] },
            { name: 'Premium', slots: 200, cpu: '6 vCores', ram: '16GB', storage: '120GB NVMe', price: 80.00, features: ['200 slots', 'Priority support', 'All features'] },
            { name: 'Enterprise', slots: 500, cpu: '8 vCores', ram: '32GB', storage: '250GB NVMe', price: 150.00, features: ['500 slots', 'Maximum resources', 'Custom configs'] }
        ],
        faqs: [
            { question: 'Which scripting languages are supported?', answer: 'RageMP supports C# and JavaScript for server-side scripting.' },
            { question: 'Is voice chat included?', answer: 'Yes, RageMP has built-in voice chat support for immersive roleplay.' },
            { question: 'How does this compare to FiveM?', answer: 'RageMP offers different scripting languages and some unique features. Both are great for GTA V multiplayer.' }
        ]
    },
    samp: {
        id: 'samp',
        slug: 'samp',
        title: 'SA-MP',
        coverImage: '/assets/img/games/samp-cover.jpg',
        pricingDisplay: '$0.25/slot',
        priceValue: 0.25,
        pricingUnit: 'slot',
        shortDescription: 'GTA San Andreas multiplayer',
        fullDescription: 'The original GTA multiplayer experience. Host SA-MP servers for classic roleplay, freeroam, and custom game modes.',
        tags: ['GTA SA', 'Roleplay', 'Classic', 'Multiplayer'],
        category: 'roleplay',
        popular: false,
        heroPoints: [
            'Pawn scripting support',
            'Classic RP experience',
            'High player capacity',
            'Low resource usage'
        ],
        features: [
            'Pawn scripting',
            'MySQL support',
            'Custom game modes',
            'Anti-cheat support',
            'RCON access',
            'Automatic backups',
            'Low-latency network',
            '24/7 uptime'
        ],
        plans: [
            { name: 'Starter', slots: 50, storage: '10GB NVMe', price: 8.00, features: ['50 slots', 'Pawn scripts', 'Daily backups'] },
            { name: 'Standard', slots: 100, storage: '20GB NVMe', price: 14.00, popular: true, features: ['100 slots', 'MySQL included', 'Hourly backups'] },
            { name: 'Premium', slots: 200, storage: '40GB NVMe', price: 25.00, features: ['200 slots', 'Priority support', 'All features'] },
            { name: 'Enterprise', slots: 500, storage: '80GB NVMe', price: 45.00, features: ['500 slots', 'Maximum resources', 'Custom configs'] }
        ],
        faqs: [
            { question: 'Do you support Pawn scripting?', answer: 'Yes! Full Pawn scripting support for custom game modes and features.' },
            { question: 'Can I run roleplay servers?', answer: 'Absolutely. SA-MP is perfect for classic GTA roleplay communities.' },
            { question: 'Is MySQL included?', answer: 'Yes, MySQL database is included for player data and server persistence.' }
        ]
    },
    'mta-sa': {
        id: 'mtasa',
        slug: 'mta-sa',
        title: 'MTA: San Andreas',
        coverImage: '/assets/img/games/mtasa-cover.jpg',
        pricingDisplay: '$0.30/slot',
        priceValue: 0.30,
        pricingUnit: 'slot',
        shortDescription: 'Multi Theft Auto servers',
        fullDescription: 'The most advanced GTA San Andreas multiplayer platform. Host MTA:SA servers with powerful Lua scripting for any game mode.',
        tags: ['GTA SA', 'Racing', 'Roleplay', 'Lua Scripting'],
        category: 'roleplay',
        popular: false,
        heroPoints: [
            'Lua scripting engine',
            'Advanced sync technology',
            'Custom resources',
            'Built-in map editor'
        ],
        features: [
            'Lua scripting',
            'MySQL database',
            'Custom resources',
            'Map editor support',
            'Anti-cheat included',
            'Automatic backups',
            'Resource management',
            '24/7 uptime'
        ],
        plans: [
            { name: 'Starter', slots: 50, storage: '15GB NVMe', price: 10.00, features: ['50 slots', 'Lua scripts', 'Daily backups'] },
            { name: 'Standard', slots: 100, storage: '30GB NVMe', price: 18.00, popular: true, features: ['100 slots', 'MySQL included', 'Hourly backups'] },
            { name: 'Premium', slots: 200, storage: '60GB NVMe', price: 32.00, features: ['200 slots', 'Priority support', 'All features'] },
            { name: 'Enterprise', slots: 500, storage: '120GB NVMe', price: 55.00, features: ['500 slots', 'Maximum resources', 'Custom configs'] }
        ],
        faqs: [
            { question: 'What scripting language does MTA use?', answer: 'MTA uses Lua for both server-side and client-side scripting.' },
            { question: 'Is it good for racing servers?', answer: 'Yes! MTA is famous for its racing community and has excellent vehicle sync.' },
            { question: 'How does it compare to SA-MP?', answer: 'MTA offers more advanced features and Lua scripting, while SA-MP uses Pawn. Both are great choices.' }
        ]
    },
    'day-of-dragons': {
        id: 'dayofdragons',
        slug: 'day-of-dragons',
        title: 'Day of Dragons',
        coverImage: '/assets/img/games/dayofdragons-cover.jpg',
        pricingDisplay: '$0.60/slot',
        priceValue: 0.60,
        pricingUnit: 'slot',
        shortDescription: 'Dragon survival servers',
        fullDescription: 'Fly as a dragon and survive in a fantasy world. Host your own Day of Dragons server for your dragon community.',
        tags: ['Survival', 'Dragons', 'Multiplayer', 'Fantasy'],
        category: 'survival',
        popular: false,
        heroPoints: [
            'Easy server setup',
            'Custom configurations',
            'World management',
            'Regular updates'
        ],
        features: [
            'Server configuration',
            'World management',
            'Password protection',
            'Automatic updates',
            'Admin commands',
            'Backup management',
            'Performance optimized',
            '24/7 uptime'
        ],
        plans: [
            { name: 'Nest', slots: 20, ram: '4GB', storage: '20GB NVMe', price: 10.00, features: ['20 players', 'Easy setup', 'Daily backups'] },
            { name: 'Clan', slots: 50, ram: '8GB', storage: '40GB NVMe', price: 22.00, popular: true, features: ['50 players', 'Custom settings', 'Hourly backups'] },
            { name: 'Kingdom', slots: 100, ram: '16GB', storage: '80GB NVMe', price: 40.00, features: ['100 players', 'Priority support', 'All features'] }
        ],
        faqs: [
            { question: 'How many players can join?', answer: 'Our plans support up to 100 players. Contact us for larger servers.' },
            { question: 'Can I configure the server settings?', answer: 'Yes! Full access to server configuration via our control panel.' },
            { question: 'Are updates automatic?', answer: 'Yes, we automatically update your server when new game updates are released.' }
        ]
    }
};

// Export for use in game.php
if (typeof module !== 'undefined' && module.exports) {
    module.exports = gamesData;
}
