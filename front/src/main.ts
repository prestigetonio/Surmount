import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './style.css';
import { addMarker, createViewer, removeMarker } from './map';
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
const entities: Cesium.Entity[] = [];
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

function deletePoint(index: number): void {
    const point = points[index];
    if (point.id !== undefined) {
        fetch(`/api/coordinates/${point.id}`, { method: 'DELETE' })
            .catch(err => console.error('Failed to delete coordinate:', err));
    }
    removeMarker(viewer, entities[index]);
    points.splice(index, 1);
    entities.splice(index, 1);
    renderPanel(points, deletePoint);
}

try {
    const res = await fetch('/api/coordinates');
    const existing: { id: number; name: string; latitude: number; longitude: number; altitude: number; added_at: string }[] = await res.json();
    for (const pt of existing) {
        const d = new Date(pt.added_at);
        points.push({
            id: pt.id,
            name: pt.name,
            lat: pt.latitude,
            lon: pt.longitude,
            alt: pt.altitude,
            addedAt: `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`,
        });
        const cartesian = Cesium.Cartesian3.fromDegrees(pt.longitude, pt.latitude, pt.altitude);
        entities.push(addMarker(viewer, cartesian, pt.name));
    }
    renderPanel(points, deletePoint);
    for (let i = 0; i < points.length; i++) {
        fetchMountainData(points[i].lat, points[i].lon).then(w => {
            if (w) { points[i].weather = w; renderPanel(points, deletePoint); }
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
    const pointIndex = points.length;
    points.push({
        name: trimmed,
        lat,
        lon,
        alt: carto.height,
        addedAt: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
    });
    entities.push(addMarker(viewer, cartesian, trimmed));

    fetch('/api/coordinates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed, latitude: lat, longitude: lon, altitude: carto.height }),
    }).then(r => r.json()).then(data => {
        if (data.id) points[pointIndex].id = data.id;
    }).catch(err => {
        console.error('Failed to send coordinates to backend:', err);
    });

    renderPanel(points, deletePoint);

    fetchMountainData(lat, lon).then(w => {
        if (w) { points[pointIndex].weather = w; renderPanel(points, deletePoint); }
    });
});

viewer.screenSpaceEventHandler.setInputAction((click: any) => {
    const ray = viewer.camera.getPickRay(click.position);
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    if (cartesian) openModal(cartesian);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
