// src/main.js

// 引入所有場景
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import WorkshopScene from './scenes/WorkshopScene.js';
import StoryScene from './scenes/StoryScene.js';
// 1. 引入新場景
import ClickEffectScene from './scenes/ClickEffectScene.js'; 

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
    },
    parent: 'game-container',
    transparent: true, 

    // 2. 加入到列表最後面 (確保它被註冊)
    scene: [ BootScene, MenuScene, WorkshopScene, StoryScene, ClickEffectScene ]
};

const game = new Phaser.Game(config);

export default game;