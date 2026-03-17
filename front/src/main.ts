import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './style.css';

import { addMarker, createViewer } from './map';
import { initModal, openModal } from './modal';
import { initPanel, renderPanel } from './panel';
import type { PointData } from './types';
import { injectUI } from './ui';

declare global {
    interface Window { CESIUM_BASE_URL: string; }
}

window.CESIUM_BASE_URL = '/cesium/';

injectUI();

const points: PointData[] = [];
const viewer = await createViewer();

initPanel();

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

    // Send coordinates to backend
    fetch('/api/coordinates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude: lat, longitude: lon }),
    }).catch((err) => {
        // Optionally handle error
        console.error('Failed to send coordinates to backend:', err);
    });

    renderPanel(points);
    addMarker(viewer, cartesian, trimmed);
});

viewer.screenSpaceEventHandler.setInputAction((click: any) => {
    const ray = viewer.camera.getPickRay(click.position);
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    if (cartesian) openModal(cartesian);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
