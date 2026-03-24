// src/scenes/MenuScene.js
// 修正版：使用 Phaser 內建寬高 (this.scale.width) 確保畫面不跑版

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('bg_menu', 'assets/bg_gate.png'); 
        this.load.image('text_play', 'assets/text_play.png');    
    }

    create() {
        // --- 取得遊戲畫面的寬高 (800 x 600) ---
        // 這樣不管螢幕多大，內容都會固定在遊戲框框內
        const width = this.scale.width;
        const height = this.scale.height;

        // --- 1. 背景 ---
        if (this.textures.exists('bg_menu')) {
            let bg = this.add.image(width / 2, height / 2, 'bg_menu');
        }

        // --- 2. 標題 ---
        const mainTitle = this.add.image(400, 220, 'text_play')
            .setAlpha(0)
            .setScale(0.4);

        this.tweens.add({
            targets: mainTitle,
            alpha: 1,       // 變清楚
            y: '-=30',      // 稍微往上浮動，更有靈動感
            duration: 1000, 
            ease: 'Power2'
        });


        // --- 3. 建立按鈕 ---
        // 使用相對位置：高度的 50% 和 65%
        this.createButton(height * 0.5, '劇情遊戲', () => {
            console.log('進入劇情模式');
            this.scene.start('StoryScene'); 
        });

        this.createButton(height * 0.65, '戲偶工作坊', () => {
            console.log('進入戲偶工作坊');
            
            const ui = document.getElementById('workshop-ui');
            if(ui) ui.style.display = 'block';

            this.scene.start('WorkshopScene');
        });
    }

    // --- 按鈕製造機 ---
    createButton(y, text, callback) {
        const x = this.scale.width / 2;
        
        // 建立 Container (容器)，把背景和文字包在一起
        const btn = this.add.container(x, y);

        // 1. 設定樣式參數
        const width = 300;
        const height = 70;
        const radius = 35; // 圓角半徑 (高度的一半就是正圓頭)
        const mainColor = 0xFFD700; // 金色
        const hoverColor = 0xFFEA00; // 亮金色
        const textColor = '#333333'; // 深灰字

        // 2. 畫出按鈕背景 (Graphics)
        const bg = this.add.graphics();
        
        // 繪製函式：畫出 陰影 + 本體 + 白框
        const drawButton = (color, scale = 1) => {
            bg.clear();
            
            // A. 陰影 (半透明黑色，稍微偏移)
            bg.fillStyle(0x000000, 0.5);
            bg.fillRoundedRect(-width/2 + 5, -height/2 + 5, width, height, radius);

            // B. 按鈕本體
            bg.fillStyle(color, 1);
            bg.fillRoundedRect(-width/2, -height/2, width, height, radius);

            // C. 白色邊框
            bg.lineStyle(3, 0xffffff, 1);
            bg.strokeRoundedRect(-width/2, -height/2, width, height, radius);
        };

        // 初始繪製
        drawButton(mainColor);

        // 3. 建立文字
        const label = this.add.text(0, 0, text, {
            fontSize: '28px',
            color: textColor,
            fontFamily: 'Microsoft JhengHei, "楷體", sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 4. 設定互動區域
        // 因為 Graphics 形狀複雜，我們用一個隱形的矩形來偵測點擊
        const hitArea = this.add.rectangle(0, 0, width, height, 0x000000, 0).setInteractive({ useHandCursor: true });
        
        btn.add([bg, label, hitArea]);

        // 5. 滑鼠事件 (互動效果)
        hitArea.on('pointerover', () => {
            drawButton(hoverColor); // 變亮
            this.tweens.add({ targets: btn, scaleX: 1.1, scaleY: 1.1, duration: 100 });
        });

        hitArea.on('pointerout', () => {
            drawButton(mainColor); // 變回原色
            this.tweens.add({ targets: btn, scaleX: 1, scaleY: 1, duration: 100 });
        });

        hitArea.on('pointerdown', () => {
            this.tweens.add({
                targets: btn,
                scaleX: 0.95, scaleY: 0.95, // 按下縮小
                duration: 50,
                yoyo: true,
                onComplete: () => {
                    if (callback) callback();
                }
            });
        });
    }
}