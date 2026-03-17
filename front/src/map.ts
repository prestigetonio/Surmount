import * as Cesium from 'cesium';

export async function createViewer(): Promise<Cesium.Viewer> {
    const viewer = new Cesium.Viewer('map', {
        terrainProvider: await Cesium.createWorldTerrainAsync(),
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
    });

    viewer.imageryLayers.removeAll();
    viewer.imageryLayers.addImageryProvider(
        await Cesium.ArcGisMapServerImageryProvider.fromUrl(
            'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
        )
    );
    viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
            url: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
        })
    );

    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.resolutionScale = 1.5;

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(0.8, 44.2, 380000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-52),
            roll: 0.0,
        },
        duration: 2,
    });

    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(0.5, 42.7, 2800),
        label: {
            text: 'PYRÉNÉES',
            font: 'bold 28px monospace',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.fromCssColorString('#0a0a1f'),
            outlineWidth: 4,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            heightReference: Cesium.HeightReference.NONE,
            eyeOffset: new Cesium.Cartesian3(0, 0, -5000),
            translucencyByDistance: new Cesium.NearFarScalar(80000, 0.0, 350000, 1.0),
            scaleByDistance: new Cesium.NearFarScalar(80000, 0.6, 500000, 1.2),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
    });

    return viewer;
}

export function addMarker(viewer: Cesium.Viewer, cartesian: Cesium.Cartesian3, name: string): void {
    viewer.entities.add({
        position: cartesian,
        point: {
            pixelSize: 10,
            color: Cesium.Color.fromCssColorString('#5b8cff'),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
            text: name,
            font: 'bold 16px monospace',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.fromCssColorString('#0a0a1f'),
            outlineWidth: 4,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -14),
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            eyeOffset: new Cesium.Cartesian3(0, 0, -100),
            scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 200000, 0.7),
            translucencyByDistance: new Cesium.NearFarScalar(500000, 1.0, 2000000, 0.0),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
    });
}
