// src/scenes/StoryScene.js
// 修正版：包含自動語音載入迴圈、安全音效檢查

export default class StoryScene extends Phaser.Scene {
    constructor() {
        super('StoryScene');
    }

    preload() {
        // --- 安全檢查：確認 script 是否存在 ---
        if (!this.cache.json.exists('script')) {
            console.error('❌ 錯誤：找不到 script (dialogue.json)。請檢查 assets/dialogue.json 是否存在。');
            return; 
        }

        const scriptData = this.cache.json.get('script');

        // --- 🗣️ 全語音自動載入 (預備用) ---
        // 如果您有錄製對應 ID 的語音 (如 start.mp3, s1.mp3)，
        // 請確保它們也都在 assets/sounds/ 裡面
        /*
        if (scriptData) {
            for (let key in scriptData) {
                // 修正路徑：統一從 assets/sounds/ 讀取
                this.load.audio(key, `assets/sounds/${key}.mp3`);
            }
        }
        */

        // --- 🎵 載入 BGM (背景音樂) ---
        // 原本在 assets/music/，現在改到 assets/sounds/
        this.load.audio('bgm_calm', 'assets/sounds/calm.mp3');
        this.load.audio('bgm_battle', 'assets/sounds/battle.mp3');
        this.load.audio('bgm_horror', 'assets/sounds/horror.mp3');

        // --- 🔊 載入嘟嘟聲 (Blip Sounds) ---
        // 這些原本就在 assets/sounds/，維持不變或確認路徑正確
        this.load.audio('voice_male', 'assets/sounds/blip_male.mp3');
        this.load.audio('voice_female', 'assets/sounds/blip_female.mp3');
        this.load.audio('voice_default', 'assets/sounds/blip_default.mp3');
        
        

        // 2. 載入介面與背景 (維持原樣)
        this.load.image('box', 'assets/box.png');
        this.load.image('button', 'assets/button.png');
        this.load.image('bg_mountain', 'assets/bg_mountain.png'); 
        this.load.image('bg_room', 'assets/bg_room.png');
        this.load.image('bg_mansion', 'assets/bg_mansion.png');
        this.load.image('bg_street', 'assets/bg_street.png');
        this.load.image('bg_streetN', 'assets/bg_streetN.png');
        this.load.image('bg_bridge', 'assets/bg_bridge.png');
        this.load.image('bg_bridgeM', 'assets/bg_bridgeM.png');
        this.load.image('bg_gate', 'assets/bg_gate.png');
        

        // 3. 載入角色立繪 (維持原樣)
        // 七爺
        this.load.image('xie', 'assets/xie.png');
        this.load.image('xie手胸前', 'assets/xie手胸前.png');
        this.load.image('xie哀', 'assets/xie哀.png');
        this.load.image('xie思考', 'assets/xie思考.png');
        this.load.image('xie哭', 'assets/xie哭.png');
        this.load.image('xie哭覺悟', 'assets/xie哭覺悟.png');
        this.load.image('xie揪甘心', 'assets/xie揪甘心.png');
        this.load.image('xie緊張', 'assets/xie緊張.png');
        this.load.image('xie奮鬥', 'assets/xie奮鬥.png');
        this.load.image('xie擔心', 'assets/xie擔心.png');
        this.load.image('xie燈泡', 'assets/xie燈泡.png');
        this.load.image('xie雙手舉笑', 'assets/xie雙手舉笑.png');
        this.load.image('xie頭痛眼暈', 'assets/xie頭痛眼暈.png');
        this.load.image('xie騎馬笑', 'assets/xie騎馬笑.png');
        this.load.image('xie騎馬哀', 'assets/xie騎馬哀.png');
        this.load.image('xie騎馬', 'assets/xie騎馬.png');
        this.load.image('xie射箭', 'assets/xie射箭.png');
        this.load.image('xie死後', 'assets/xie死後.png');
        
        
        // 八爺
        this.load.image('fan', 'assets/fan.png');
        this.load.image('fan小哀', 'assets/fan小哀.png');
        this.load.image('fan哀', 'assets/fan哀.png');
        this.load.image('fan手胸前', 'assets/fan手胸前.png');
        this.load.image('fan思考', 'assets/fan思考.png');
        this.load.image('fan酒', 'assets/fan酒.png');
        this.load.image('fan高興', 'assets/fan高興.png');
        this.load.image('fan雙手舉高', 'assets/fan雙手舉高.png');
        this.load.image('fan騎馬', 'assets/fan騎馬.png');
        this.load.image('fan騎馬射箭', 'assets/fan騎馬射箭.png');
        this.load.image('fan讚', 'assets/fan讚.png');
        this.load.image('fan兔', 'assets/fan兔.png');
        this.load.image('fan拳', 'assets/fan拳.png');
        this.load.image('fan出拳', 'assets/fan出拳.png');
        this.load.image('fan死後', 'assets/fan死後.png');
        
        // 小鳳
        this.load.image('girl', 'assets/girl.png');
        this.load.image('girl生氣', 'assets/girl生氣.png');
        this.load.image('girl氣', 'assets/girl氣.png');
        this.load.image('girl哀', 'assets/girl哀.png');
        this.load.image('girl哀哀', 'assets/girl哀哀.png');
        this.load.image('girl哭', 'assets/girl哭.png');
        this.load.image('girl哭哭', 'assets/girl哭哭.png');
        this.load.image('girl嚇', 'assets/girl嚇.png');
        this.load.image('girl氣哭', 'assets/girl氣哭.png');
        
        // 朱有財
        this.load.image('zhu', 'assets/zhu.png');
        this.load.image('zhu賤', 'assets/zhu賤.png');
        this.load.image('zhu生氣', 'assets/zhu生氣.png');
        this.load.image('zhu色', 'assets/zhu色.png');
        this.load.image('zhu錢', 'assets/zhu錢.png');
        this.load.image('zhu死', 'assets/zhu死.png');


        // 福伯
        this.load.image('oldman', 'assets/oldman.png');
        this.load.image('oldman嚇', 'assets/oldman嚇.png');
        this.load.image('oldman死', 'assets/oldman死.png');
        this.load.image('oldman怕', 'assets/oldman怕.png');
        this.load.image('oldman哀', 'assets/oldman哀.png');
        this.load.image('oldman累', 'assets/oldman累.png');
        this.load.image('oldman噓', 'assets/oldman噓.png');
        this.load.image('oldman笑', 'assets/oldman笑.png');


        
        // 人
        this.load.image('datou', 'assets/datou.png');
        this.load.image('taishou', 'assets/taishou.png');
        this.load.image('aunt', 'assets/aunt.png');
        this.load.image('villager', 'assets/villager.png');
        this.load.image('officer', 'assets/officer.png');
    }

    create() {
        // --- 1. 建立背景 (這部分你已經成功了) ---
        this.bg = this.add.image(400, 300, 'bg_mountain'); 
        
        // --- 2. 建立天氣特效素材 (雨滴/雪花) ---
        let graphics = this.make.graphics({x: 0, y: 0, add: false});
        graphics.fillStyle(0xffffff, 0.8);
        graphics.fillRect(0, 0, 2, 15);
        graphics.generateTexture('rain_drop', 2, 15);
        graphics.clear();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(5, 5, 5);
        graphics.generateTexture('snow_flake', 10, 10);

        // --- 3. 建立對話框與立繪 ---
        this.portrait = this.add.image(400, 190, 'girl').setScale(0.22).setVisible(false);
        this.dialogBox = this.add.image(400, 500, 'box').setDepth(2);

        // --- 4. 建立文字物件 ---
        this.nameText = this.add.text(55, 420, '讀取中...', { 
            fontSize: '28px', color: '#ba1f1f', fontStyle: 'bold', fontFamily: 'KaiTi, "楷體", Arial'
        }).setDepth(3);

        this.msgText = this.add.text(100, 470, '', { 
            fontSize: '24px', color: '#ffffff', fontFamily: 'KaiTi, "楷體", Arial',
            stroke: '#000000', strokeThickness: 3, wordWrap: { width: 560, useAdvancedWrap: true }, lineSpacing: 10
        }).setDepth(3);

        // --- ⭐ 5. 關鍵偵錯：檢查劇本是否載入成功 ---
        this.storyData = this.cache.json.get('script');

        if (!this.storyData) {
            // ❌ 如果劇本讀失敗，直接在畫面上顯示大大的紅字
            console.error('劇本讀取失敗！Story Data is undefined');
            this.msgText.setText("❌ 嚴重錯誤：讀不到 dialogue.json 劇本檔！\n\n1. 請檢查 assets/dialogue.json 是否存在。\n2. 請按 F12 看 Console 錯誤訊息。");
            this.msgText.setColor('#ff0000'); // 紅字
            return; // 停止執行，避免當機
        }

        // --- 6. 建立天氣發射器 ---
        this.rainEmitter = this.add.particles(0, 0, 'rain_drop', {
            x: { min: 0, max: 800 }, y: -50, lifespan: 1200, speedY: { min: 600, max: 800 },
            quantity: 2, frequency: 10, emitting: false
        }).setDepth(1);

        this.snowEmitter = this.add.particles(0, 0, 'snow_flake', {
            x: { min: 0, max: 800 }, y: -50, lifespan: 5000, speedY: { min: 50, max: 150 },
            quantity: 1, frequency: 200, emitting: false
        }).setDepth(1);

        // --- 7. 一切正常，開始播放劇情 ---
        this.currentKey = 'start'; 
        this.isWaitingForInput = false; 
        this.choiceButtons = []; 

        // 這裡會呼叫 playScript
        try {
            this.playScript(this.currentKey);
        } catch (e) {
            // 如果 playScript 內部出錯，這裡會抓到
            this.msgText.setText("❌ 播放錯誤：\n" + e.message);
        }

        // 點擊換下一句
        this.input.on('pointerdown', (pointer) => {
        // 如果選單目前是顯示狀態，就不觸發下一句劇情
            if (this.settingsPanel.visible) return; 

            if (this.isWaitingForInput) {
                this.nextStep();
            }
        });


        // --- ⚙️ 系統選單功能 ---

        // ============================================================
        //  精緻版系統選單 (保留原有功能)
        // ============================================================

        // 1. 建立齒輪按鈕 (放在右上角)
        // 設定 Origin(0.5) 是為了讓旋轉動畫以中心點旋轉
        // 1. 建立齒輪按鈕 (放在右上角)
        this.settingsBtn = this.add.text(750, 40, '⚙️', { 
            fontSize: '35px',
            
            // 【新增這行】 給它一點呼吸空間，上下左右各多 10px
            padding: { x: 10, y: 10 } 
            
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(200);

        // 加入齒輪互動動畫
        this.settingsBtn.on('pointerover', () => {
            this.tweens.add({ targets: this.settingsBtn, angle: 180, duration: 500, ease: 'Back.out' });
        });
        this.settingsBtn.on('pointerout', () => {
            this.tweens.add({ targets: this.settingsBtn, angle: 0, duration: 500, ease: 'Back.out' });
        });

        // 2. 建立選單容器 (初始隱藏)
        // 放在畫面中心 (400, 300)
        this.settingsPanel = this.add.container(400, 300).setDepth(201).setVisible(false);

        // --- A. 全螢幕遮罩 (讓背景變暗，點擊旁邊可關閉) ---
        // 座標相對於容器，所以要反向推算 (-400, -300) 覆蓋全螢幕
        const overlay = this.add.rectangle(0, 0, 800, 600, 0x000000, 0.6)
            .setInteractive({ useHandCursor: true });
        
        overlay.on('pointerdown', () => {
            toggleMenu(false); // 點擊空白處關閉
        });
        this.settingsPanel.add(overlay);

        // --- B. 選單背景 (圓角金框) ---
        const panelWidth = 320;
        const panelHeight = 450;
        const panelBg = this.add.graphics();
        
        // 陰影
        panelBg.fillStyle(0x000000, 0.5);
        panelBg.fillRoundedRect(-panelWidth/2 + 8, -panelHeight/2 + 8, panelWidth, panelHeight, 20);
        // 本體
        panelBg.fillStyle(0x222222, 0.95); // 深灰色
        panelBg.fillRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight, 20);
        // 金框
        panelBg.lineStyle(3, 0xFFD700);
        panelBg.strokeRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight, 20);

        this.settingsPanel.add(panelBg);

        // --- C. 選單標題 ---
        const menuTitle = this.add.text(0, -160, '系統設置', {
            fontSize: '32px',
            color: '#FFD700',
            fontFamily: '"Noto Serif TC", serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.settingsPanel.add(menuTitle);


        // --- D. 建立通用按鈕函式 (讓程式碼更乾淨) ---
        const createMenuBtn = (y, text, colorCode, callback) => {
            const btnContainer = this.add.container(0, y);
            
            // 繪製按鈕背景
            const bg = this.add.graphics();
            const w = 240, h = 55, r = 25;
            
            const draw = (color) => {
                bg.clear();
                bg.fillStyle(color, 1);
                bg.fillRoundedRect(-w/2, -h/2, w, h, r);
                bg.lineStyle(2, 0xFFFFFF, 0.3);
                bg.strokeRoundedRect(-w/2, -h/2, w, h, r);
            };
            draw(colorCode); // 初始顏色

            // 按鈕文字
            const label = this.add.text(0, 0, text, {
                fontSize: '22px',
                color: '#ffffff',
                fontFamily: '"Noto Serif TC", serif'
            }).setOrigin(0.5);

            // 互動區域
            const hitArea = this.add.rectangle(0, 0, w, h, 0x000000, 0).setInteractive({ useHandCursor: true });

            // 互動事件
            hitArea.on('pointerover', () => {
                draw(0xFFD700); // 變金色
                label.setColor('#000000');
                btnContainer.setScale(1.05);
            });
            hitArea.on('pointerout', () => {
                draw(colorCode); // 變回原色
                label.setColor('#ffffff');
                btnContainer.setScale(1);
            });
            hitArea.on('pointerdown', () => {
                this.tweens.add({
                    targets: btnContainer,
                    scaleX: 0.95, scaleY: 0.95, yoyo: true, duration: 50,
                    onComplete: callback
                });
            });

            btnContainer.add([bg, label, hitArea]);
            this.settingsPanel.add(btnContainer);
            return label; // 回傳文字物件以便修改 (給靜音按鈕用)
        };


        // --- E. 實作功能按鈕 ---

        // 1. 靜音按鈕 (深灰色)
        this.isMuted = this.sound.mute; // 同步目前狀態
        const muteTextObj = createMenuBtn(-50, this.isMuted ? '🔊 開啟音效' : '🔇 切換靜音', 0x444444, () => {
            this.isMuted = !this.isMuted;
            this.sound.mute = this.isMuted;
            muteTextObj.setText(this.isMuted ? '🔊 開啟音效' : '🔇 切換靜音');
        });

        // 2. 重新開始 (深灰色)
        createMenuBtn(40, '🔄 重新開始', 0x444444, () => {
            this.scene.restart();
        });

        // 3. 退出遊戲 (紅色強調)
        createMenuBtn(130, '🚪 退出遊戲', 0x8b0000, () => {
            this.scene.start('BootScene');
        });


        // --- F. 開關選單邏輯 ---
        const toggleMenu = (show) => {
            this.settingsPanel.setVisible(show);
            
            // 處理打字機暫停邏輯
            if (this.typingTimer) {
                this.typingTimer.paused = show; // 選單打開時 -> 暫停
            }
        };

        // 點擊齒輪切換
        this.settingsBtn.on('pointerdown', () => {
            const isVisible = this.settingsPanel.visible;
            toggleMenu(!isVisible);
        });

    }


    // --- 核心邏輯 ---

    playScript(key) {
        // ⚠️ 關鍵：更新 currentKey，這樣自動語音才能抓到正確的 ID
        this.currentKey = key; 

        const data = this.storyData[key];
        if (!data) {
            console.log("劇本結束或找不到 ID: " + key);
            return;
        }
        if (data.type === 'dialogue') {
            this.handleDialogue(data);
        } else if (data.type === 'choice') {
            this.handleChoice(data);
        }
    }

    // src/scenes/StoryScene.js

    handleDialogue(data) {
        // 1. 換背景 & 立繪 (維持原樣)
        if (data.bg) this.bg.setTexture(data.bg);
        if (data.face) {
            this.portrait.setTexture(data.face);
            this.portrait.setVisible(true);
        } else {
            this.portrait.setVisible(false);
        }

        // 2. 導演特效 (維持原樣)
        if (data.effect === 'shake') this.cameras.main.shake(500, 0.05);
        if (data.effect === 'flash') this.cameras.main.flash(200, 255, 255, 255);
        if (data.effect === 'fade') this.cameras.main.fadeIn(1000);
        
        // --- ⭐ 更新：支援多重特效 (Array) ---
        // 這一行是關鍵：不管 JSON 寫的是單個字串 "rain_start" 還是陣列 ["rain_start", "thunder"]
        // 我們都把它統一轉成陣列處理，這樣寫法最彈性
        const effects = [].concat(data.effect || []);

        effects.forEach(effect => {
            // 1. 舊有特效
            if (effect === 'shake') this.cameras.main.shake(500, 0.05);
            if (effect === 'flash') this.cameras.main.flash(200, 255, 255, 255);
            if (effect === 'fade') this.cameras.main.fadeIn(1000);

            // 2. ⚡ 打雷
            if (effect === 'thunder') {
                this.cameras.main.flash(150, 255, 255, 255);
                this.cameras.main.shake(300, 0.05);
                // this.sound.play('thunder_sfx'); 
            }

            // 3. 🌧️ 下雨控制
            if (effect === 'rain_start') this.rainEmitter.start();
            if (effect === 'rain_stop') this.rainEmitter.stop();

            // 4. ❄️ 下雪控制
            if (effect === 'snow_start') this.snowEmitter.start();
            if (effect === 'snow_stop') this.snowEmitter.stop();
        });

        // 4. 名字設定與顏色 (維持原樣)
        const nameColors = {
            "七爺謝必安": "#a70404ff", "七爺": "#a70404ff",
            "八爺范無咎": "#4e2e23ff", "八爺": "#4e2e23ff",
            "鳳兒": "#e27995ff", "福伯": "#4148d1ff",
            "朱公子": "#ed1280ff", "旁白": "#252323ff"
        };
        // 為了比對方便，這裡先存下名字
        const charName = data.name || "旁白"; 
        this.nameText.setText(charName);
        this.nameText.setColor(nameColors[charName] || '#000000ff');

        // --- ⭐ 5. 聲音身分證設定 (全新功能) ---
        // key: 基礎音效檔名
        // rate: 播放速度 (越快聲音越高越急)
        // detune: 音高偏移 (-1200 到 1200，負數更低沈，正數更尖銳)
        // interval: 頻率 (每幾個字響一次，2=每兩個字響一次)
        
        const voiceProfiles = {
            "七爺": { key: 'voice_male', rate: 1.0, detune: 0, interval: 3 }, // 正常溫文儒雅
            "七爺謝必安": { key: 'voice_male', rate: 1.0, detune: 0, interval: 3 },
            
            "八爺": { key: 'voice_male', rate: 1.2, detune: -500, interval: 2 }, // 急躁、低沈粗曠
            "八爺范無咎": { key: 'voice_male', rate: 1.2, detune: -500, interval: 2 },
            
            "鳳兒": { key: 'voice_female', rate: 1.1, detune: 200, interval: 2 }, // 輕快少女
            "朱公子": { key: 'voice_male', rate: 0.9, detune: 100, interval: 3 }, // 慢條斯理
            
            "旁白": { key: 'voice_default', rate: 1.0, detune: 0, interval: 2 },
            "default": { key: 'voice_default', rate: 1.0, detune: 0, interval: 2 }
        };

        // 取得當前角色的聲音設定，找不到就用 default
        // 我們用模糊比對，例如 "七爺(生氣)" 也能抓到 "七爺" 的設定
        let currentProfile = voiceProfiles["default"];
        for (const key in voiceProfiles) {
            if (charName.includes(key)) {
                currentProfile = voiceProfiles[key];
                break;
            }
        }

        // --- 處理舊有的「全語音」 (如果有完整錄音檔，優先播放完整錄音) ---
        if (this.currentVoice) this.currentVoice.stop();
        let hasFullVoice = false;
        if (this.currentKey && this.cache.audio.exists(this.currentKey)) {
             this.currentVoice = this.sound.add(this.currentKey);
             this.currentVoice.play({ volume: 1.0 });
             hasFullVoice = true; // 標記有全語音，等一下就不播嘟嘟聲
        }

        // 6. 打字機效果 (包含音效播放)
        this.msgText.setText('');
        this.isWaitingForInput = false;
        
        const fullText = data.text;
        let currentCharIndex = 0;

        if (this.typingTimer) this.typingTimer.remove();

        this.typingTimer = this.time.addEvent({
            delay: 50, // 打字速度
            callback: () => {
                this.msgText.text += fullText[currentCharIndex];
                
                // --- ⭐ 播放角色音效 ---
                // 條件：沒有全語音 AND 符合該角色的發聲頻率 (interval)
                if (!hasFullVoice && currentCharIndex % currentProfile.interval === 0) {
                     // 為了讓聲音更自然，我們在設定的 detune 基礎上，加一點點隨機變化 (-50 ~ 50)
                     const randomDetune = Phaser.Math.Between(-50, 50);
                     
                     this.sound.play(currentProfile.key, { 
                        volume: 0.3, 
                        rate: currentProfile.rate,
                        detune: currentProfile.detune + randomDetune 
                     });
                }

                currentCharIndex++;
                if (currentCharIndex >= fullText.length) {
                    this.isWaitingForInput = true;
                    this.typingTimer.remove();
                }
            },
            repeat: fullText.length - 1
        });
    }

    handleChoice(data) {
        this.isWaitingForInput = false;
        this.nameText.setText(""); 
        this.msgText.setText(data.text);
        this.clearButtons(); 

        let startY = 250;
        data.options.forEach((opt, index) => {
            const btnContainer = this.add.container(400, startY + index * 70);
            const bg = this.add.rectangle(0, 0, 400, 50, 0x8B0000)
                .setStrokeStyle(2, 0xFFD700)
                .setInteractive({ useHandCursor: true });

            const text = this.add.text(0, 0, opt.label, { 
                fontSize: '22px', color: '#fff', fontFamily: 'KaiTi, "楷體", Arial'
            }).setOrigin(0.5);

            btnContainer.add([bg, text]);

            bg.on('pointerover', () => bg.setFillStyle(0xA52A2A));
            bg.on('pointerout', () => bg.setFillStyle(0x8B0000));
            bg.on('pointerdown', () => {
                this.clearButtons();
                this.playScript(opt.next); // 點擊後跳轉
            });

            btnContainer.setAlpha(0);
            this.tweens.add({
                targets: btnContainer,
                alpha: 1,
                y: startY + index * 70,
                duration: 500,
                delay: index * 200,
                ease: 'Power2'
            });

            this.choiceButtons.push(btnContainer);
        });
    }

    nextStep() {
        const data = this.storyData[this.currentKey];
        if (data.next) {
            this.playScript(data.next);
        }
    }

    clearButtons() {
        if (this.choiceButtons.length > 0) {
            this.choiceButtons.forEach(btn => btn.destroy());
            this.choiceButtons = [];
        }
    }
}