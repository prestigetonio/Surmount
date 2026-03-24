import type { PointData, WeatherData } from './types';

const sidePanel   = () => document.getElementById('side-panel')!;
const panelList   = () => document.getElementById('panel-list')!;
const panelEmpty  = () => document.getElementById('panel-empty')!;
const panelToggle = () => document.getElementById('panel-toggle')!;
const panelClose  = () => document.getElementById('panel-close')!;
const counterEl   = () => document.getElementById('counter-num')!;

function buildWeatherHtml(w: WeatherData | undefined, riskColors: string[]): string {
    if (!w) return '<div class="weather-loading">chargement des données...</div>';
    const color = riskColors[w.risk] ?? '#fff';
    return `
        <div class="weather-section">
            <div class="weather-risk" style="border-left: 3px solid ${color}">
                <span class="risk-label">RISQUE AVALANCHE</span>
                <span class="risk-value" style="color:${color}">${w.risk} — ${w.riskLabel.toUpperCase()}</span>
            </div>
            <div class="point-card-info">
                <div class="info-item"><span class="info-label">TEMP</span><span class="info-value">${w.temperature}°C</span></div>
                <div class="info-item"><span class="info-label">VENT</span><span class="info-value">${w.windSpeed} km/h</span></div>
                <div class="info-item"><span class="info-label">NEIGE</span><span class="info-value">${w.snowDepth} cm</span></div>
                <div class="info-item"><span class="info-label">PENTE</span><span class="info-value">${w.slopeAngle}°</span></div>
            </div>
        </div>`;
}

export function initPanel(): void {
    panelToggle().addEventListener('click', () => sidePanel().classList.add('open'));
    panelClose().addEventListener('click', () => sidePanel().classList.remove('open'));
}

export function renderPanel(points: PointData[]): void {
    panelEmpty().style.display = points.length === 0 ? 'flex' : 'none';
    panelList().querySelectorAll('.point-card').forEach(el => el.remove());
    const riskColors = ['', '#4CAF50', '#8BC34A', '#FFC107', '#FF5722', '#F44336'];
    for (const p of points) {
        const card = document.createElement('div');
        card.className = 'point-card';
        const weatherHtml = buildWeatherHtml(p.weather, riskColors);
        card.innerHTML = `
            <div class="point-card-name">${p.name}</div>
            <div class="point-card-info">
                <div class="info-item"><span class="info-label">LAT</span><span class="info-value">${p.lat.toFixed(4)}</span></div>
                <div class="info-item"><span class="info-label">LON</span><span class="info-value">${p.lon.toFixed(4)}</span></div>
                <div class="info-item"><span class="info-label">ALT</span><span class="info-value">${Math.round(p.alt)}m</span></div>
                <div class="info-item"><span class="info-label">T</span><span class="info-value">${p.addedAt}</span></div>
            </div>
            ${weatherHtml}`;
        panelList().appendChild(card);
    }
    counterEl().textContent = String(points.length);
}
