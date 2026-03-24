import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

export default class WorkshopScene extends Phaser.Scene {
    constructor() {
        super('WorkshopScene');

        // 1. 定義初始裝備
        this.currentParts = {
            Head: "01",
            Body: "01",
            Hand_L: "01",
            Hand_R: "01"
        };
        this.isControlling = true;
    }

    create() {
    // 1. 強制將 Phaser UI 拉到最上層 (您的原代碼)
    const phaserCanvas = this.game.canvas;
    const threeCanvas = document.getElementById('three-canvas');
    if (phaserCanvas) {
        phaserCanvas.style.zIndex = "10";
        phaserCanvas.style.position = "absolute";
    }
    if (threeCanvas) {
        threeCanvas.style.zIndex = "1";
    }

    this.createSystemMenu();
    this.cameras.main.setBackgroundColor('rgba(0,0,0,0)');

    // 2. 初始化 3D 環境
    this.init3D();

    // 3. 載入模型 (省略部分載入邏輯...)
    const loader = new GLTFLoader();
    loader.load('assets/puppet.glb', (gltf) => {
        this.puppet = gltf.scene;
        this.puppet.scale.set(12, 12, 12);
        this.puppet.position.set(0, -62, 0);
        this.puppet.rotation.y = -Math.PI / 2;
        this.scene3D.add(this.puppet);
        this.refreshPuppetAppearance();

        // 在 create() 函式內
window.changePart = (partName, partID) => {
    console.log(`更換部件: ${partName} 為 ${partID}`);
    
    // 1. 更新資料
    if (this.currentParts) {
        this.currentParts[partName] = partID;
    }
    
    // 2. 執行換裝
    this.updatePuppetVisuals(partName, partID);
};
    });

    // 4. 建立「啟動按鈕」(解決行動端權限必備)
    const startBtn = this.add.text(400, 300, '【 點擊啟動 AR 操偶 】', {
        fontSize: '32px',
        backgroundColor: '#ba1f1f',
        padding: { x: 20, y: 10 },
        color: '#ffffff',
        fontFamily: 'Microsoft JhengHei'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(500);

    startBtn.on('pointerdown', async () => {
        startBtn.setText('讀取中...');
        await this.startARSystem(); // 點擊後一次啟動所有系統
        startBtn.destroy();
    });

    // 綁定儲存按鈕等 (原邏輯)
    window.changePart = (category, id) => this.changePart(category, id);
}

async startARSystem() {
    const videoElement = document.querySelector('.input_video');
    if (!videoElement) return;

    try {
        this.hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        this.hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 0,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.hands.onResults((results) => {
            if (this.isControlling && results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                this.updatePuppet(results.multiHandLandmarks[0]);
            }
        });

        this.camera = new Camera(videoElement, {
            onFrame: async () => {
                if (this.hands) {
                    await this.hands.send({ image: videoElement });
                }
            },
            width: 640,
            height: 480
        });

       // 在 startARSystem() 裡面的成功回饋處
await this.camera.start();
this.isControlling = true;

// 強制顯示鏡頭畫面並確保它在最底層
const videoElement = document.querySelector('.input_video');
if (videoElement) {
    videoElement.style.display = 'block';
    videoElement.style.position = 'absolute';
    videoElement.style.top = '0';
    videoElement.style.left = '0';
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';
    videoElement.style.zIndex = '-1'; // 放最底層，才不會擋住 3D 戲偶
    videoElement.style.objectFit = 'cover';
}
}

loadPuppetParts() {
    const loader = new GLTFLoader();
    const SMOOTH_SPEED = 0.2;

    // 定義要更換的部位與對應的模型群組
    const partsToLoad = [
        { name: 'Head', group: 'headGroup' },
        { name: 'Body', group: 'bodyGroup' },
        { name: 'Hand_L', group: 'handL' },
        { name: 'Hand_R', group: 'handR' }
    ];

    partsToLoad.forEach(part => {
        const partID = this.currentParts[part.name];
        // 假設您的路徑結構是 assets/models/Head_01.glb
        const modelPath = `assets/models/${part.name}_${partID}.glb`;

        loader.load(modelPath, (gltf) => {
            // 1. 如果原本已經有該部位，先從 puppet 中移除
            if (this[part.group]) {
                this.puppet.remove(this[part.group]);
            }

            // 2. 取得新模型並設定
            const newModel = gltf.scene;
            
            // 3. 將新模型賦值給對應的變數 (如 this.headGroup)
            this[part.group] = newModel;

            // 4. 加回 puppet 容器中
            this.puppet.add(newModel);

            console.log(`${part.name} 已更換為 ID: ${partID}`);
        }, undefined, (error) => {
            console.error(`${part.name} 載入失敗，路徑可能錯誤: ${modelPath}`, error);
        });
    });
}


    // ============================================================
    //  精緻版系統選單 (移植到工作坊)
    // ============================================================
    createSystemMenu() {
        // 1. 建立齒輪按鈕 (放在右上角，加入 padding 防止被切邊)
        this.settingsBtn = this.add.text(750, 40, '⚙️', { 
            fontSize: '35px',
            padding: { x: 10, y: 10 } 
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(300); // 設定高一點的 Depth，確保浮在最上層

        // 齒輪旋轉動畫
        this.settingsBtn.on('pointerover', () => {
            this.tweens.add({ targets: this.settingsBtn, angle: 180, duration: 500, ease: 'Back.out' });
        });
        this.settingsBtn.on('pointerout', () => {
            this.tweens.add({ targets: this.settingsBtn, angle: 0, duration: 500, ease: 'Back.out' });
        });

        // 2. 建立選單容器 (初始隱藏)
        this.settingsPanel = this.add.container(400, 300).setDepth(301).setVisible(false);

        // --- A. 全螢幕遮罩 (讓背景變暗，點擊旁邊可關閉) ---
        // 注意：這裡我們用比較大的範圍確保覆蓋整個畫面
        const overlay = this.add.rectangle(0, 0, 800, 600, 0x000000, 0.6)
            .setInteractive({ useHandCursor: true });
        
        overlay.on('pointerdown', () => {
            toggleMenu(false);
        });
        this.settingsPanel.add(overlay);

        // --- B. 選單背景 (圓角金框) ---
        const panelWidth = 320;
        const panelHeight = 350; // 稍微短一點，因為功能少一個
        const panelBg = this.add.graphics();
        
        // 陰影
        panelBg.fillStyle(0x000000, 0.5);
        panelBg.fillRoundedRect(-panelWidth/2 + 8, -panelHeight/2 + 8, panelWidth, panelHeight, 20);
        // 本體
        panelBg.fillStyle(0x222222, 0.95);
        panelBg.fillRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight, 20);
        // 金框
        panelBg.lineStyle(3, 0xFFD700);
        panelBg.strokeRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight, 20);

        this.settingsPanel.add(panelBg);

        // --- C. 選單標題 ---
        const menuTitle = this.add.text(0, -120, '系統設置', {
            fontSize: '32px',
            color: '#FFD700',
            fontFamily: '"Noto Serif TC", serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.settingsPanel.add(menuTitle);

        // --- D. 通用按鈕製造機 ---
        const createMenuBtn = (y, text, colorCode, callback) => {
            const btnContainer = this.add.container(0, y);
            const w = 240, h = 55, r = 25;
            
            const bg = this.add.graphics();
            const draw = (color) => {
                bg.clear();
                bg.fillStyle(color, 1);
                bg.fillRoundedRect(-w/2, -h/2, w, h, r);
                bg.lineStyle(2, 0xFFFFFF, 0.3);
                bg.strokeRoundedRect(-w/2, -h/2, w, h, r);
            };
            draw(colorCode);

            const label = this.add.text(0, 0, text, {
                fontSize: '22px',
                color: '#ffffff',
                fontFamily: '"Noto Serif TC", serif'
            }).setOrigin(0.5);

            const hitArea = this.add.rectangle(0, 0, w, h, 0x000000, 0).setInteractive({ useHandCursor: true });

            hitArea.on('pointerover', () => {
                draw(0xFFD700); label.setColor('#000000');
                btnContainer.setScale(1.05);
            });
            hitArea.on('pointerout', () => {
                draw(colorCode); label.setColor('#ffffff');
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
            return label;
        };

        // --- E. 功能按鈕 ---


        // 2. 回主選單 (這是最重要的功能)
        createMenuBtn(60, '🏠 回主選單', 0x8b0000, () => {
            console.log("正在返回主選單...");

            // 1. 隱藏 HTML 的換裝介面 (確保不會殘留在畫面上)
            const workshopUI = document.getElementById('workshop-ui');
            if (workshopUI) workshopUI.style.display = 'none';

            // 2. 關閉視訊鏡頭 (重要！釋放相機資源)
            const videoElement = document.querySelector('.input_video');
            if (videoElement) {
                videoElement.style.display = 'none';
                if (videoElement.srcObject) {
                    const tracks = videoElement.srcObject.getTracks();
                    tracks.forEach(track => track.stop()); // 停止所有鏡頭串流
                    videoElement.srcObject = null;
                }
            }
            // --- 【新增】 隱藏 Three.js 3D 畫布 ---
            // 這一步最重要！讓戲偶消失
            const threeCanvas = document.getElementById('three-canvas');
            if (threeCanvas) {
                threeCanvas.style.display = 'none';
            }

            // 3. 切換場景 (這行才是真正跳轉)
            this.scene.start('MenuScene');
        });

        // 2. 【新增】取消/繼續操偶 (位置：20)
        createMenuBtn(-30, '❌ 取消返回', 0x444444, () => {
            // 呼叫 toggleMenu(false) 來關閉選單
            // 這會自動觸發 "this.isControlling = true" (在下方的 toggleMenu 邏輯裡)
            toggleMenu(false);
        });

        // --- F. 開關邏輯 ---
        const toggleMenu = (show) => {
            this.settingsPanel.setVisible(show);
            
            // 當選單打開時，我們可以選擇是否要暫停「手部追蹤」
            // 這裡設定為：選單打開時，暫停控制 (isControlling = false)
            // 選單關閉時，恢復控制 (isControlling = true)
            this.isControlling = !show;
        };

        this.settingsBtn.on('pointerdown', () => {
            toggleMenu(!this.settingsPanel.visible);
        });
    }


    // ==========================================
    //  新增狀態控制函式
    // ==========================================
    
    // 進入換裝模式：暫停追蹤，顯示面板
    enterCustomizeMode() {
        console.log("進入換裝模式");
        this.isControlling = false; // 關鍵：暫停 updatePuppet
        
        // 顯示面板，隱藏主按鈕
        document.getElementById('customization-panel').style.display = 'block';
        document.getElementById('main-controls').style.display = 'none';

    

        // (選用) 讓戲偶回到中間，方便預覽
        if (this.puppet) {
            this.puppet.position.set(-2, -6, 0);
            this.puppet.rotation.set(0, -Math.PI/2, 0);
            // 重置頭部與手部角度，讓它變成立正姿勢
            if(this.headGroup) this.headGroup.rotation.set(0,0,0);
            if(this.handL) this.handL.rotation.set(0,0,0);
            if(this.handR) this.handR.rotation.set(0,0,0);
        }
    }

    // 儲存並恢復：隱藏面板，恢復追蹤
    saveAndResume() {
        console.log("設定已儲存，繼續操偶");
        
        // 隱藏面板，顯示主按鈕
        document.getElementById('customization-panel').style.display = 'none';
        document.getElementById('main-controls').style.display = 'block';

        // 恢復追蹤
        this.isControlling = true;
    }

    // ==========================================
    //  換裝系統
    // ==========================================
    changePart(category, id) {
        if (this.currentParts[category]) {
            this.currentParts[category] = id;
            this.refreshPuppetAppearance();
        }
    }

    refreshPuppetAppearance() {
        if (!this.puppet) return;

        this.puppet.traverse((child) => {
            if (child.isMesh) {
                let matchedCategory = null;
                for (const cat of Object.keys(this.currentParts)) {
                    if (child.name.startsWith(cat)) {
                        matchedCategory = cat;
                        break;
                    }
                }

                if (matchedCategory) {
                    const targetName = `${matchedCategory}_${this.currentParts[matchedCategory]}`;
                    
                    if (child.name === targetName) {
                        child.visible = true;
                        // 綁定骨架變數
                        if (matchedCategory === 'Head') this.headGroup = child;
                        if (matchedCategory === 'Body') this.bodyGroup = child;
                        if (matchedCategory === 'Hand_L') this.handL = child;
                        if (matchedCategory === 'Hand_R') this.handR = child;
                    } else {
                        child.visible = false;
                    }
                }
            }
        });
    }

    // ==========================================
    //  3D 初始化
    // ==========================================
    init3D() {
        // --- 1. 使用「視窗大小」而非遊戲大小 ---
        // 這樣確保 3D 畫布的中心點 = 螢幕中心點 = 遊戲介面中心點
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(width, height);
        
        // --- 設定 DOM 元素 ---
        const threeCanvas = this.renderer.domElement;
        threeCanvas.id = 'three-canvas';
        
        // --- 關鍵 CSS 設定 ---
        // 使用 fixed 讓它永遠覆蓋整個視窗背景
        threeCanvas.style.position = 'fixed'; 
        threeCanvas.style.top = '0';
        threeCanvas.style.left = '0';
        threeCanvas.style.zIndex = '1'; // 背景層
        threeCanvas.style.pointerEvents = 'none'; // 讓滑鼠點擊穿透
        threeCanvas.style.display = 'block';

        // --- 設定 Phaser 介面層級 ---
        if (this.game.canvas) {
            this.game.canvas.style.position = 'absolute';
            this.game.canvas.style.zIndex = '10'; // 前景層
        }

        // --- 加入網頁 ---
        // 先移除舊的 (避免重複)
        const oldCanvas = document.getElementById('three-canvas');
        if (oldCanvas) oldCanvas.remove();

        document.body.appendChild(threeCanvas);

        // --- 建立場景與攝影機 ---
        this.scene3D = new THREE.Scene();

        // 攝影機 Aspect Ratio 也要用視窗長寬比
        this.camera3D = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        this.camera3D.position.set(0, 0, 20);
        
        // 燈光
        this.scene3D.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(2, 2, 2);
        this.scene3D.add(dirLight);

        // --- 【額外加分】 監聽視窗縮放 ---
        // 如果玩家改變視窗大小，3D 畫布也要跟著變，不然會變形
        window.addEventListener('resize', () => {
            if (!this.renderer) return;
            const w = window.innerWidth;
            const h = window.innerHeight;
            this.renderer.setSize(w, h);
            this.camera3D.aspect = w / h;
            this.camera3D.updateProjectionMatrix();
        });
    }

  updatePuppetVisuals(partName, partID) {
    const loader = new GLTFLoader();
    // 根據您的 index.html，路徑格式應該是 assets/models/Head_01.glb
    // 注意：partName 可能是 'Head', 'Body', 'Hand_L', 'Hand_R'
    const modelPath = `assets/models/${partName}_${partID}.glb`;

    loader.load(modelPath, (gltf) => {
        const newPart = gltf.scene;
        
        // 根據部位決定替換哪個變數
        if (partName === 'Head') {
            if (this.headGroup) this.puppet.remove(this.headGroup);
            this.headGroup = newPart;
            this.puppet.add(this.headGroup);
        } else if (partName === 'Body') {
            if (this.bodyGroup) this.puppet.remove(this.bodyGroup);
            this.bodyGroup = newPart;
            this.puppet.add(this.bodyGroup);
        } else if (partName.includes('Hand')) {
            // 如果是手部，根據 L 或 R 替換
            const side = partName.split('_')[1]; // L 或 R
            const target = side === 'L' ? 'handL' : 'handR';
            if (this[target]) this.puppet.remove(this[target]);
            this[target] = newPart;
            this.puppet.add(this[target]);
        }
        
        console.log(`${partName} 更換成功！`);
    }, undefined, (err) => {
        console.error("模型載入失敗，請檢查路徑:", modelPath);
    });
}

    updatePuppet(landmarks) {
        if (!this.puppet || !this.isControlling) return;
        
        const head = this.headGroup;
        const handL = this.handL;
        const handR = this.handR;
        const body = this.bodyGroup;

        if (!head || !handL || !handR) return;

        // 關鍵點
        const wrist = landmarks[0];       
        const thumbTip = landmarks[4];    
        const indexBase = landmarks[5];   
        const indexTip = landmarks[8];    
        const midRoot = landmarks[9];     
        const middleTip = landmarks[12];  

        const SMOOTH_SPEED = 0.2; 

        // 1. 左右手判斷
        let fingerOnScreenLeft, fingerOnScreenRight;
        if (thumbTip.x < middleTip.x) {
            fingerOnScreenLeft = thumbTip;   
            fingerOnScreenRight = middleTip; 
        } else {
            fingerOnScreenLeft = middleTip;  
            fingerOnScreenRight = thumbTip;  
        }

        // ============================================
        // 2. 身體位移 & 旋轉 (改為：手勢方向控制旋轉)
        // ============================================
        const BODY_MOVE_SENSITIVITY = 15.0; 
        const palmX = (wrist.x + midRoot.x) / 2;
        const palmY = (wrist.y + midRoot.y) / 2;

        // A. 位移 (身體還是會跟著手的位置走，但不會轉身)
        let targetPuppetX = (palmX - 0.5) * -BODY_MOVE_SENSITIVITY; 
        let targetPuppetY = (palmY - 0.5) * -BODY_MOVE_SENSITIVITY; 
        targetPuppetY += -0.5;

        targetPuppetX = Phaser.Math.Clamp(targetPuppetX, -20, 20);
        targetPuppetY = Phaser.Math.Clamp(targetPuppetY, -12, 12);

        this.puppet.position.x += (targetPuppetX - this.puppet.position.x) * SMOOTH_SPEED;
        this.puppet.position.y += (targetPuppetY - this.puppet.position.y) * SMOOTH_SPEED;

        // B. 全身旋轉 (Hand Orientation Control) 🔥 這裡改了 🔥
        // 邏輯：計算「中指尖」與「手腕」的水平距離
        // 手直直向上 -> 差值約為 0 -> 正面
        // 手指向左歪 -> 差值為負 -> 向左轉
        // 手指向右歪 -> 差值為正 -> 向右轉
        
        const ROTATION_SENSITIVITY = 3.0; // 轉身靈敏度
        
        // 計算傾斜量 (Tip.x - Wrist.x)
        // 我們用這隻「主要控制手」(通常是畫面左邊那隻，也就是你的右手) 來判斷
        // 或者你可以用兩隻手的平均，這裡先用 fingerOnScreenLeft (你的右手)
        
        // 為了更精準，我們用中指尖 (landmarks[12]) 減去 手腕 (landmarks[0])
        const leanX = middleTip.x - wrist.x;

        // 基礎角度 -Math.PI/2 (因為模型預設側身) + 傾斜量 * 靈敏度
        // 注意：如果發現轉的方向反了，把 + 改成 -
        let targetBodyRotY = -Math.PI / 2 - (leanX * ROTATION_SENSITIVITY);
        
        // 限制角度 (不要讓頭轉到背後)
        targetBodyRotY = Phaser.Math.Clamp(targetBodyRotY, -Math.PI/2 - 1.2, -Math.PI/2 + 1.2);

        this.puppet.rotation.y += (targetBodyRotY - this.puppet.rotation.y) * SMOOTH_SPEED;

        // ============================================
        // 3. 頭部控制 (讓頭跟隨身體自然擺動)
        // ============================================
        
        // 因為身體已經轉了，頭部只要微調上下就好，左右由身體帶動
        // 當然，我們可以保留一點點頭部的額外轉動，讓動作更生動
        
        const h_dx = (indexTip.x - wrist.x); // 這是手指的指向
        let targetHeadY = h_dx * 2.0; // 降低係數，因為身體已經在轉了
        
        // 抬頭/低頭邏輯維持
        const palmSize = Phaser.Math.Distance.Between(wrist.x, wrist.y, midRoot.x, midRoot.y);
        const indexFingerLen = Phaser.Math.Distance.Between(indexTip.x, indexTip.y, indexBase.x, indexBase.y);
        let curlRatio = 1.0;
        if (palmSize > 0.001) curlRatio = indexFingerLen / palmSize;
        let targetHeadPitch = THREE.MathUtils.mapLinear(curlRatio, 0.4, 0.9, -0.6, -0.1);
        targetHeadPitch = Phaser.Math.Clamp(targetHeadPitch, -0.8, 1.5);

        // 套用頭部
        head.rotation.y += (targetHeadY - head.rotation.y) * SMOOTH_SPEED;
        head.rotation.z += (targetHeadPitch - head.rotation.z) * SMOOTH_SPEED;
        
        // 身體微調 (Body Group) - 稍微減少，因為現在整個 puppet 都在轉
        if (body) {
            body.rotation.y += (targetHeadY * 0.1 - body.rotation.y) * SMOOTH_SPEED;
        }

        // ============================================
        // 4. 手臂控制 (開合跳 + 拍手) - 維持原本邏輯
        // ============================================

        const handsDistance = Phaser.Math.Distance.Between(
            fingerOnScreenLeft.x, fingerOnScreenLeft.y,
            fingerOnScreenRight.x, fingerOnScreenRight.y
        );

        const isClapping = handsDistance < 0.15;

        let targetL_Z, targetL_X, targetL_Y;
        let targetR_Z, targetR_X, targetR_Y;

        if (isClapping) {
            // --- 👏👏 拍手 ---
            const clapHeight = -0.3; 
            const clapAngle = 1.6; 

            targetR_X = clapHeight;
            targetR_Y = -clapAngle; 
            targetR_Z = 0;          

            targetL_X = clapHeight;
            targetL_Y = clapAngle;  
            targetL_Z = 0;
            
        } else {
            // --- 🦅 開合跳 ---
            let rawHeightR = fingerOnScreenLeft.y; 
            let rawHeightL = fingerOnScreenRight.y;

            // 右手
            let angleR = THREE.MathUtils.mapLinear(rawHeightR, 1.0, 0.0, -1.5, 1.5);
            targetR_X = angleR; 
            targetR_Z = 0;     
            targetR_Y = 0; 

            // 左手
            let angleL = THREE.MathUtils.mapLinear(rawHeightL, 1.0, 0.0, -1.5, 1.5);
            targetL_X = -angleL; // 修正：左手跟右手鏡像，通常數值正負相同或相反視模型而定，目前先設正
            targetL_Z = 0;
            targetL_Y = 0;
        }

        // 套用數值
        handL.rotation.z += (targetL_Z - handL.rotation.z) * SMOOTH_SPEED;
        handL.rotation.x += (targetL_X - handL.rotation.x) * SMOOTH_SPEED;
        handL.rotation.y += (targetL_Y - handL.rotation.y) * (SMOOTH_SPEED * 0.5);

        handR.rotation.z += (targetR_Z - handR.rotation.z) * SMOOTH_SPEED;
        handR.rotation.x += (targetR_X - handR.rotation.x) * SMOOTH_SPEED;
        handR.rotation.y += (targetR_Y - handR.rotation.y) * (SMOOTH_SPEED * 0.5);
    }

    update() {
        if (this.renderer && this.scene3D && this.camera3D) {
            this.renderer.render(this.scene3D, this.camera3D);
        }
    }
}
