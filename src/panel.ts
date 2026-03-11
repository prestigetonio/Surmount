import type { PointData } from './types';

const sidePanel   = () => document.getElementById('side-panel')!;
const panelList   = () => document.getElementById('panel-list')!;
const panelEmpty  = () => document.getElementById('panel-empty')!;
const panelToggle = () => document.getElementById('panel-toggle')!;
const panelClose  = () => document.getElementById('panel-close')!;
const counterEl   = () => document.getElementById('counter-num')!;

export function initPanel(): void {
    panelToggle().addEventListener('click', () => sidePanel().classList.add('open'));
    panelClose().addEventListener('click', () => sidePanel().classList.remove('open'));
}

export function renderPanel(points: PointData[]): void {
    panelEmpty().style.display = points.length === 0 ? 'flex' : 'none';
    panelList().querySelectorAll('.point-card').forEach(el => el.remove());

    for (const p of points) {
        const card = document.createElement('div');
        card.className = 'point-card';
        card.innerHTML = `
            <div class="point-card-name">${p.name}</div>
            <div class="point-card-info">
                <div class="info-item"><span class="info-label">LAT</span><span class="info-value">${p.lat.toFixed(4)}</span></div>
                <div class="info-item"><span class="info-label">LON</span><span class="info-value">${p.lon.toFixed(4)}</span></div>
                <div class="info-item"><span class="info-label">ALT</span><span class="info-value">${Math.round(p.alt)}m</span></div>
                <div class="info-item"><span class="info-label">T</span><span class="info-value">${p.addedAt}</span></div>
            </div>`;
        panelList().appendChild(card);
    }

    counterEl().textContent = String(points.length);
}
