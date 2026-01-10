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
    }
};

// Export for use in game.php
if (typeof module !== 'undefined' && module.exports) {
    module.exports = gamesData;
}
