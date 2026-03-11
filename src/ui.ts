export function injectUI(): void {
    document.body.insertAdjacentHTML('afterbegin', `
        <div id="header">
            <div id="logo">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="15" stroke="#5b8cff" stroke-width="1.5"/>
                    <path d="M4 16 H28" stroke="rgba(91,140,255,0.5)" stroke-width="1"/>
                    <circle cx="16" cy="16" r="3" fill="#5b8cff"/>
                </svg>
                <div id="logo-text">Sur<span>mount</span></div>
            </div>
            <div id="badge">POC v1</div>
        </div>

        <div id="counter"><span id="counter-num">0</span>&nbsp;pts</div>

        <button id="panel-toggle">données</button>

        <div id="side-panel">
            <div id="panel-header">
                <h3>données</h3>
                <button id="panel-close">×</button>
            </div>
            <div id="panel-list">
                <div id="panel-empty">aucun point</div>
            </div>
        </div>

        <div id="hint"><div class="dot"></div>cliquer pour placer un point</div>

        <div id="modal-overlay">
            <div id="modal">
                <h2>nom du point</h2>
                <input id="point-name" type="text" placeholder="nom…" autocomplete="off" />
                <div id="modal-actions">
                    <button id="btn-cancel" class="btn">annuler</button>
                    <button id="btn-confirm" class="btn">placer</button>
                </div>
            </div>
        </div>
    `);
}
