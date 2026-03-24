import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './style.css';
import { addMarker, createViewer } from './map';
import { initModal, openModal } from './modal';
import { initPanel, renderPanel } from './panel';
import type { PointData, WeatherData } from './types';
import { injectUI } from './ui';

declare global {
    interface Window { CESIUM_BASE_URL: string; }
}

window.CESIUM_BASE_URL = '/cesium/';

injectUI();
const points: PointData[] = [];
const viewer = await createViewer();
initPanel();
async function fetchMountainData(lat: number, lon: number): Promise<WeatherData | undefined> {
    try {
        const r = await fetch(`/api/mountain-data?lat=${lat}&lon=${lon}`);
        if (!r.ok) return undefined;
        return await r.json() as WeatherData;
    } catch {
        return undefined;
    }
}

try {
    const res = await fetch('/api/coordinates');
    const existing: { name: string; latitude: number; longitude: number; altitude: number; added_at: string }[] = await res.json();
    for (const pt of existing) {
        const d = new Date(pt.added_at);
        points.push({
            name: pt.name,
            lat: pt.latitude,
            lon: pt.longitude,
            alt: pt.altitude,
            addedAt: `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`,
        });
        const cartesian = Cesium.Cartesian3.fromDegrees(pt.longitude, pt.latitude, pt.altitude);
        addMarker(viewer, cartesian, pt.name);
    }
    renderPanel(points);
    for (let i = 0; i < points.length; i++) {
        fetchMountainData(points[i].lat, points[i].lon).then(w => {
            if (w) { points[i].weather = w; renderPanel(points); }
        });
    }
} catch (err) {
    console.error('Failed to load coordinates from backend:', err);
}

initModal((cartesian: Cesium.Cartesian3, name: string) => {
    const trimmed = name.trim() || 'sans nom';
    const carto = Cesium.Cartographic.fromCartesian(cartesian);
    const now = new Date();

    const lat = Cesium.Math.toDegrees(carto.latitude);
    const lon = Cesium.Math.toDegrees(carto.longitude);
    points.push({
        name: trimmed,
        lat,
        lon,
        alt: carto.height,
        addedAt: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
    });

    fetch('/api/coordinates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed, latitude: lat, longitude: lon, altitude: carto.height }),
    }).catch((err) => {
        console.error('Failed to send coordinates to backend:', err);
    });

    renderPanel(points);
    addMarker(viewer, cartesian, trimmed);

    const pointIndex = points.length - 1;
    fetchMountainData(lat, lon).then(w => {
        if (w) { points[pointIndex].weather = w; renderPanel(points); }
    });
});

viewer.screenSpaceEventHandler.setInputAction((click: any) => {
    const ray = viewer.camera.getPickRay(click.position);
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    if (cartesian) openModal(cartesian);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
