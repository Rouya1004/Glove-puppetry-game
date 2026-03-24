// src/scenes/BootScene.js
// C 計畫：精緻的動畫開場 (已修正：提早載入劇本)

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.image('bg_start', 'assets/bg_start.png');
        this.load.json('script', 'assets/dialogue.json');
        this.load.image('title_main', 'assets/title_main.png');
        this.load.image('title_sub', 'assets/title_sub.png'); // 副標題圖
    }

    create() {
        this.scene.launch('ClickEffectScene');
        // 1. 背景 (做一點縮放特效)
        let bg = this.add.image(400, 300, 'bg_start');
        
        // --- 2. 顯示標題圖片 ---

        // A. 主標題 (放在畫面中間偏上)
        // setAlpha(0) 是為了讓它一開始隱藏，等一下做淡入動畫
        const mainTitle = this.add.image(380, 230, 'title_main')
            .setAlpha(0)
            .setScale(0.4); // 如果圖片太大，可以改這個數字 (0.5 ~ 1.0)

        // B. 副標題 (放在主標題下面)
        const subTitle = this.add.image(400, 360, 'title_sub')
            .setAlpha(0)
            .setScale(0.2); // 副標題通常小一點

        // --- 3. 進場動畫 ---
        
        // 讓主標題先浮現
        this.tweens.add({
            targets: mainTitle,
            alpha: 1,       // 變清楚
            y: '-=30',      // 稍微往上浮動，更有靈動感
            duration: 1000, 
            ease: 'Power2'
        });
        // 讓副標題慢 0.8 秒再出來
        this.tweens.add({
            targets: subTitle,
            alpha: 1,
            y: '-=20',
            duration: 1000,
            delay: 500,     // 延遲執行
            ease: 'Power2',
            onComplete: () => {
                this.showTapText(); // 動畫播完後，顯示「點擊開始」
            }
        });

        // 4. 點擊進入選單
        this.input.once('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0); 
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('MenuScene');
            });
        });
    }

    showTapText() {
        const tapText = this.add.text(400, 420, '- 點擊螢幕開始 -', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: '"Noto Serif TC", serif',
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: tapText,
            alpha: 1,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }
}