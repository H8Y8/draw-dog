# Draw Dog Asset Mapping (v1)

> 這是第一版 asset mapping，目標是先把目前這批生成圖對應到遊戲內物件，方便後續替換與程式接線。
> 命名先以目前收到的原始檔名為準，等正式整理進 `assets/` 再改成乾淨檔名。

---

## 1. 狗狗主角

### Dog Idle / 待機主圖
- `file_22---1a065583-7148-4518-9e83-fa04fe214e3a.jpg`

### Dog Scared / 緊張受威脅
- `file_23---37d0342e-bf41-4350-9f7a-fde66ba7a5fc.jpg`

### Dog Happy / 過關開心
- `file_24---f87bfceb-b016-4354-b36b-c774f79a9739.jpg`

### Dog Extra Candidate / 備用狗狗圖
- `file_36---1c41367b-8242-44a8-b00e-56352945fbb7.jpg`

---

## 2. 蜜蜂 / 敵人

### Bee Main
- `file_25---0105f0ef-8d7f-4ab1-83e9-00ec51faa5c3.jpg`

### Bee Alt / 備用或飛行第二幀
- `file_26---4348a253-19e2-47d7-afe5-cb9e84e15749.jpg`

---

## 3. 蜂巢

### Hive Main
- `file_27---7efb4399-3036-4b6a-aad8-9a6d917ebe8f.jpg`

### Hive Alt / 備用
- `file_28---9bf557c0-dbef-4c7e-85bb-667ced22378c.jpg`

---

## 4. 地形 / 平台

### Short Platform
- `file_29---90b642e3-d765-480f-bfa2-49cdfb84f9d7.jpg`

### Long Platform
- `file_30---17158b23-b092-4dfc-aadc-75b4d5b37f7a.jpg`

### Platform Alt / 可切分地形用
- `file_31---1b62b081-3ed7-47e3-b952-25ab18dd12c6.jpg`

---

## 5. UI 按鈕

### Start Button
- `file_32---6bef68e2-f4d1-481d-bce6-c5ce6b05a474.jpg`

### Replay Button
- `file_33---b7af59d0-4b67-478e-857b-76f808757eca.jpg`

### Next Button
- `file_34---ba48e655-b6a3-4111-a380-c04f698cac0f.jpg`

---

## 6. 結算 / UI 面板

### Result Panel Main
- `file_35---7f313c93-c618-470e-aaa1-6bf3ec51dcc5.jpg`

---

## 7. 建議整理後檔名

後續建議整理成：

```text
assets/images/
  dog-idle.png
  dog-scared.png
  dog-happy.png
  dog-alt.png
  bee-01.png
  bee-02.png
  hive-01.png
  hive-02.png
  platform-short.png
  platform-long.png
  platform-alt.png
  ui-start-button.png
  ui-replay-button.png
  ui-next-button.png
  ui-result-panel.png
```

---

## 8. 程式替換對應

### 角色
- `src/game/objects/Dog.ts`
- `src/game/objects/Bee.ts`
- `src/game/objects/Hive.ts`

### 地形
- `src/game/objects/Platform.ts`

### UI
- `src/game/scenes/MenuScene.ts`
- `src/game/scenes/UIScene.ts`

---

## 9. 下一步建議

下一步直接做這三件：

1. 把原圖整理進專案 `assets/images/`
2. 轉成實際遊戲使用的 PNG / WebP
3. 逐步把 placeholder 圖形替換成 sprite / image
