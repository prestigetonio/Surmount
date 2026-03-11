import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './style.css';

import { injectUI } from './ui';
import { createViewer, addMarker } from './map';
import { initPanel, renderPanel } from './panel';
import { initModal, openModal } from './modal';
import type { PointData } from './types';

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

    points.push({
        name: trimmed,
        lat: Cesium.Math.toDegrees(carto.latitude),
        lon: Cesium.Math.toDegrees(carto.longitude),
        alt: carto.height,
        addedAt: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
    });

    renderPanel(points);
    addMarker(viewer, cartesian, trimmed);
});

viewer.screenSpaceEventHandler.setInputAction((click: any) => {
    const ray = viewer.camera.getPickRay(click.position);
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    if (cartesian) openModal(cartesian);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
