# Draw Dog Tech Spec v1

## 1. 文件目的

本文件是依據 `PRD.md` 延伸出的首版技術規格，目標是讓專案可以直接進入實作。

範圍聚焦在：
- MVP 技術選型
- 系統架構
- 核心資料流
- 畫線與碰撞體實作策略
- 關卡資料格式
- 效能與風險控制

---

## 2. 技術選型定案

## 2.1 最終技術棧
- **語言**：TypeScript
- **遊戲框架**：Phaser
- **物理引擎**：Matter.js（使用 Phaser 內建整合）
- **建置工具**：Vite
- **資源格式**：PNG / WebP / JSON / MP3 / WAV
- **版本控制**：Git

## 2.2 為什麼不用 PixiJS + Matter.js
雖然 PixiJS 渲染很強，但這個專案首版更需要的是：
- 低整合成本
- 快速進入可玩狀態
- 內建 input / scale / scene workflow

因此 MVP 階段不採用 PixiJS 自組架構。

---

## 3. 目標平台與執行條件

### 3.1 目標平台
- iPhone Safari
- Android Chrome
- 桌機 Chrome / Safari / Edge

### 3.2 顯示方向
- **直式模式優先**
- 桌機等比顯示

### 3.3 邏輯解析度
建議先固定：
- **720 x 1280**

之後可視素材密度改為：
- 1080 x 1920

### 3.4 縮放策略
- Phaser Scale Mode：`FIT`
- `autoCenter`: center both
- 保持固定世界座標
- 不採用自由 `RESIZE` 改寫整個關卡邏輯

---

## 4. 專案目錄建議

```text
draw-dog/
  src/
    main.ts
    game/
      config/
        gameConfig.ts
      scenes/
        BootScene.ts
        MenuScene.ts
        LevelScene.ts
        UIScene.ts
      systems/
        InputLineSystem.ts
        LineBuilder.ts
        BeeSystem.ts
        CollisionSystem.ts
        LevelLoader.ts
        AudioSystem.ts
      objects/
        Dog.ts
        Bee.ts
        Hive.ts
        Platform.ts
        DrawBarrier.ts
      data/
        levels/
          level-001.json
          level-002.json
      types/
        level.ts
        game.ts
    assets/
      images/
      audio/
      ui/
  public/
  PRD.md
  TECH_SPEC_V1.md
```

---

## 5. 場景架構

## 5.1 BootScene
責任：
- 載入基本資源
- 初始化全域設定
- 導向 MenuScene

## 5.2 MenuScene
責任：
- 顯示開始按鈕
- 顯示關卡入口
- 音效開關

## 5.3 LevelScene
責任：
- 載入單一關卡資料
- 建立狗狗、蜂巢、蜜蜂、平台
- 管理畫線、碰撞、勝敗
- 驅動倒數與關卡流程

## 5.4 UIScene
責任：
- 顯示剩餘秒數
- 顯示剩餘線長
- 顯示成功 / 失敗彈窗
- 顯示重玩 / 下一關按鈕

---

## 6. 核心遊戲流程

```text
進入關卡
→ 建立場景與物件
→ 玩家按下開始畫線
→ 即時顯示預覽線
→ 放開後提交線條
→ 線條轉為碰撞體
→ 蜜蜂持續攻擊 / 移動
→ 倒數歸零且狗狗存活 = win
→ 任一蜜蜂碰到狗狗 = lose
```

---

## 7. 核心資料模型

## 7.1 LevelData

```ts
export interface LevelData {
  id: number;
  timer: number;
  maxLineLength: number;
  dog: {
    x: number;
    y: number;
  };
  beehives: Array<{
    x: number;
    y: number;
    beeCount: number;
  }>;
  platforms: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
  }>;
  hazards?: Array<{
    type: 'spike' | 'lava' | 'bomb' | 'water';
    x: number;
    y: number;
    w?: number;
    h?: number;
  }>;
}
```

## 7.2 DrawPoint

```ts
export interface DrawPoint {
  x: number;
  y: number;
}
```

## 7.3 BarrierSegment

```ts
export interface BarrierSegment {
  x: number;
  y: number;
  length: number;
  angle: number;
  thickness: number;
}
```

---

## 8. 畫線系統設計

## 8.1 輸入流程
1. pointerdown：開始記錄點位
2. pointermove：持續收集點位並即時渲染預覽線
3. pointerup：停止收集、驗證、簡化、建立碰撞體

## 8.2 驗證規則
- 起點不可落在狗狗碰撞區內
- 路徑不可穿越狗狗碰撞區
- 總線長不可超過 `maxLineLength`
- 點數不可超過上限
- 路徑需至少達到最小長度

## 8.3 簡化策略
不要把所有原始 pointer 點都直接拿去做 body。

建議流程：
1. 原始點位收集
2. 去除太近的重複點
3. 做 path simplification
4. 轉為 segment list
5. 每個 segment 建立細長矩形靜態 body

## 8.4 為什麼用 segment bodies
相較於直接建立複雜 polygon：
- 更穩定
- 更容易除錯
- 更適合手機
- 更容易控制厚度與碰撞結果

## 8.5 線條渲染
建議拆成兩層：
- **preview line**：玩家畫線中顯示
- **final barrier line**：提交後固定顯示

預覽層只負責視覺，不參與碰撞。
正式 barrier 才建立 physics bodies。

---

## 9. 物理與碰撞設計

## 9.1 Matter World 設定
- gravity: 0 或極低
- setBounds: true
- fixed timestep: 60Hz
- static bodies：平台、地板、保護線
- dynamic bodies：蜜蜂
- sensor / collision callbacks：狗狗受擊判定

## 9.2 狗狗
- 可做成 static body 或 sensor body
- 只要偵測被蜜蜂接觸即可判失敗
- 不需要複雜剛體反應

## 9.3 蜜蜂
- dynamic bodies
- 可設定：
  - 小體積碰撞體
  - 固定速度範圍
  - 輕微隨機擾動
  - 反彈係數

## 9.4 平台 / 地形
- static rectangle bodies
- 盡量使用簡單矩形，避免過早引入複雜 shape

## 9.5 失敗判定
- 當 bee body 與 dog sensor 碰撞
- 立即 freeze 或 slow motion
- 顯示 fail UI

## 9.6 勝利判定
- 倒數時間到
- 且 dog 未被擊中
- 觸發 success UI

---

## 10. 蜜蜂移動策略

MVP 不需要真正複雜 AI。

建議實作：
- 蜜蜂從蜂巢附近出生
- 以狗狗為大方向移動
- 加入少量隨機偏移
- 撞到牆後依物理反彈
- 可用固定頻率微調 velocity，避免卡牆

目的：
- 看起來像「一直想叮狗狗」
- 但不增加太多 CPU 成本

---

## 11. UI / UX 技術需求

### 11.1 HUD
- 倒數秒數
- 剩餘可畫長度
- 關卡編號

### 11.2 狀態彈窗
- 成功：下一關 / 重玩
- 失敗：重玩

### 11.3 非法畫線回饋
- 線條變紅
- 短暫抖動
- 顯示簡短提示文字

---

## 12. 音效系統

MVP 音效事件：
- 畫線開始
- 畫線完成
- 蜜蜂撞牆
- 倒數緊張提示
- 過關
- 失敗

建議：
- 先做簡單音效池
- 背景音樂可後補

---

## 13. 關卡資料載入

### 13.1 格式
每關一個 JSON 或合併成一個 levels.json 都可。

MVP 建議：
- 先用單一 `levels.json`
- 開發效率較高

### 13.2 載入方式
- BootScene 載入 JSON
- LevelScene 按 level id 取資料

### 13.3 關卡難度控制參數
- timer
- beeCount
- hive position
- dog position
- maxLineLength
- platform layout

---

## 14. 效能預算

### 14.1 MVP 目標
- 低階手機 30 FPS+
- 中高階手機 60 FPS 目標
- 首屏進入遊戲時間短

### 14.2 限制建議
- 單關蜜蜂數：5–12
- 單條 barrier segment：建議 12–32 段以內
- 單關動態 body 數量盡量低
- 避免每 frame 重建 graphics object

### 14.3 最容易出問題的點
- 原始畫線點過多
- barrier body 過碎
- 蜜蜂數量過大
- 同時播放太多音效

---

## 15. 測試重點

### 15.1 功能測試
- 能否正常畫線
- 線長限制是否正確
- 非法畫線是否阻止
- 蜜蜂是否被牆阻擋
- 狗狗被碰到是否立即失敗
- 倒數到 0 是否穩定過關

### 15.2 裝置測試
- iPhone Safari
- Android Chrome
- 桌機 Chrome

### 15.3 體感測試
- 第一關是否 10 秒內能理解
- 失敗是否覺得公平
- 重玩是否足夠快

---

## 16. 開發拆分建議

### Phase 1：灰盒原型
- 基本場景
- 狗狗、蜜蜂、平台 placeholder
- 可畫線
- barrier collider
- win / lose

### Phase 2：關卡資料化
- levels.json
- 關卡切換
- 20 關基礎內容

### Phase 3：美術替換
- 導入 image-2 素材
- 調整 UI
- 音效補齊

### Phase 4：Polish
- 動畫
- 手感
- 效能微調

---

## 17. 待決策事項

以下可在實作前快速定案：
- 邏輯解析度是否固定為 720x1280
- 倒數時間預設是 6 秒、8 秒還是 10 秒
- 線條厚度是否固定
- 是否首版就做 20 關，還是先做 10 關 playable
- 是否先只做 1 種蜜蜂行為

---

## 18. 建議的首個工程目標

第一個 milestone 不要追求完整內容，而是追求：

**「做出 1 個能玩、能過關、手感正常的灰盒關卡」**

驗收條件：
- 手機上可畫線
- 蜜蜂會撞牆
- 狗狗會被保護
- 能成功 / 失敗
- 重玩順暢
