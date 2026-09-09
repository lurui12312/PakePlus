window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// ============================================================
// Pake Plus 融合脚本: 链接拦截 + 自定义返回按钮
// ============================================================

// ---------- 第一部分: 链接拦截 (原有功能) ----------
const hookClick = (e) => {
    const origin = e.target.closest('a');
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    );
    console.log('origin', origin, isBaseTargetBlank);
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault();
        console.log('handle origin', origin);
        location.href = origin.href;
    } else {
        console.log('not handle origin', origin);
    }
};

window.open = function (url, target, features) {
    console.log('open', url, target, features);
    location.href = url;
};

document.addEventListener('click', hookClick, { capture: true });

// ---------- 第二部分: 自定义返回按钮 (新增) ----------
(function() {
    // 防止重复注入
    if (document.getElementById('pake-back-btn')) return;

    // 1. 创建返回按钮元素
    const btn = document.createElement('div');
    btn.id = 'pake-back-btn';
    btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    `;

    // 2. 设置样式
    const style = document.createElement('style');
    style.textContent = `
        #pake-back-btn {
            position: fixed;
            top: 16px;
            left: 16px;
            z-index: 999999;
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.55);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.15);
            opacity: 0;
            pointer-events: none;
            user-select: none;
        }
        #pake-back-btn.visible {
            opacity: 1;
            pointer-events: auto;
        }
        #pake-back-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
        }
        #pake-back-btn:active {
            transform: scale(0.92);
        }
    `;
    document.head.appendChild(style);

    // 3. 插入按钮到页面
    document.body.appendChild(btn);

    // 4. 核心逻辑：点击后退
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (window.history.length > 1) {
            window.history.back();
        } else {
            btn.style.transform = 'scale(0.8)';
            setTimeout(() => btn.style.transform = '', 200);
        }
    });

    // 5. 控制按钮显示/隐藏
    function updateVisibility() {
        if (window.history.length > 1) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }

    // 监听页面变化 (SPA 应用路由切换时更新)
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(updateVisibility, 150);
        }
    });
    observer.observe(document, { subtree: true, childList: true });

    // 监听 popstate 事件
    window.addEventListener('popstate', updateVisibility);

    // 初始化显示状态
    setTimeout(updateVisibility, 300);

    console.log('[Pake Plus] 自定义返回按钮已加载');
})();