export default class ClickEffectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ClickEffectScene' });
    }

    create() {
        // --- 1. 產生粒子貼圖 (共用) ---
        if (!this.textures.exists('spark_particle')) {
            const graphics = this.make.graphics({ x: 0, y: 0, add: false });
            graphics.fillStyle(0xffffff, 1);
            graphics.fillCircle(10, 10, 10);
            graphics.generateTexture('spark_particle', 20, 20);
        }

        // ==========================================
        //  特效 A：滑鼠「移動」時的拖尾 (Magic Trail)
        // ==========================================
        this.trailEmitter = this.add.particles(0, 0, 'spark_particle', {
            lifespan: 300,           // 存活時間短一點 (才不會擋視線)
            speed: { min: 0, max: 20 }, // 速度慢，因為是留在原地的殘影
            scale: { start: 0.4, end: 0 }, // 比點擊特效小顆很多
            alpha: { start: 0.6, end: 0 }, // 半透明，比較柔和
            blendMode: 'ADD',        
            quantity: 1,             // 每次產生的數量少
            frequency: 40,           // 發射頻率 (越小越密，越大越像虛線)
            
            // 顏色：純金色，帶一點點橘
            tint: [ 0xffd700, 0xffa500 ] 
        });

        // 🔥 關鍵指令：讓發射器自動黏在滑鼠上
        this.trailEmitter.startFollow(this.input.activePointer);


        // ==========================================
        //  特效 B：滑鼠「點擊」時的爆炸 (Click Burst)
        // ==========================================
        this.clickEmitter = this.add.particles(0, 0, 'spark_particle', {
            lifespan: 500,
            speed: { min: 150, max: 350 },
            scale: { start: 0.8, end: 0 }, // 點擊時大顆一點
            alpha: { start: 1, end: 0 },
            rotate: { min: 0, max: 360 },
            blendMode: 'ADD',
            emitting: false, // 預設不發射，點擊才發射
            
            // 顏色：金色、橘紅、白 (比較華麗)
            tint: [ 0xffd700, 0xff4500, 0xffffff ] 
        });

        // 監聽點擊
        this.input.on('pointerdown', (pointer) => {
            this.clickEmitter.explode(10, pointer.x, pointer.y);
        });
    }
}