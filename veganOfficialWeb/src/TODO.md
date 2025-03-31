# Overview
  TODO: 複製環境變數到生產環境，nginx放行綠界、google回調
  TODO: 手機初始化卡頓、hiring未正常運作
  TODO: 測試SSE
  TODO: 改google oauth redirect url
    ❗❗❗ 訂單多項目時排版確認、多筆歷史訂單時排版確認
------------------------------------------------------------------------
    ✔️  手機滾動時網址列縮放會造成重複觸發resize，使用閥值解決
    ✔️  server 寄送email改為用戶輸入的
    ✔️  手機開啟首頁之 location 組件台灣 svg 無顯示 => 因為沒有設定width導致無法顯示
    ✔️  購物車為空時不要發送menu請求 & menu、登入頁、新聞欄位 skeleton rwd 
    ✔️ 手機開啟商品詳情IG跑版 => height:auto
    ✔️ menu未加載search無法正常顯示 => fetch menu on mounted
    ✔️ toast rwd
    ✔️ 改mobile home banner 尺寸
    ✔️ server 配置跨域，前端取消代理伺服器(生產環境配置nginx 反向代理)
    ✔️ npm start不時會發生服務端無法響應資源(開機後第一次start)原因未知 => 環境變數未加載
    ✔️ 修改email驗證跳轉component server跳轉改前端站內跳轉
    ✔️ account 付款按紐
------------------------------------------------------------------------
# DOING: 會員卡 臨時會員 結帳頁

# pages--home 
    ## mainBanner
    * 加入跳轉按鈕
    * 圖片在大解析度時width不自然 => fixed
    * 恢復自動輪播 => fixed

    ## catalog
    * 互動 hover 菜單 icon 打開menu
    * 請求超時進不了首頁(基本架構完成就進頁面) => fixed
    * catalog讀取完成後出現動畫
    * 分頁切換動畫 => fixed

    ## location

    ##news
    * 畫面縮小時滑鼠跟隨位置錯誤 => fixed
    * 路由api請求改到onMounted

    ## hiring

    ##concept
    * 標籤顏色
    * 箭頭換橫的
    * 大視口時滑鼠高亮位置不對 => fixed
    * 數據未返回時的骨架屏 => use spinner

# pages--menu
    ## product頁面縮放造成骨架屏樣式塌陷 => fixed, cancel img skeleton

# pages--checkout


# pages--login
    ## autofocusInput的功能未確認是否正常(因 veeValidate 的DOM無法在 onMounted 中獲取)

# components
    ## header

    ## header, footer
    * 在大解析度位置不正確=>fixed

    ## menu product
    * 初次進入頁面會跳動，需骨架屏=>fixed

    ## order counter
!!! * 組件 v model 組件內ref 則一(問卷使用v model，其他地方未確認)

    ## footer
!!! * 初始化不要播放箭頭動畫

# style
    ##font
    ~~*改用google font api，可以用preConnect~~

    