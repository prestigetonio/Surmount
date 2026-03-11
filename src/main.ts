import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

declare global {
  interface Window {
    CESIUM_BASE_URL: string;
  }
}

window.CESIUM_BASE_URL = '/cesium/';

async function initMap() {
    const viewer = new Cesium.Viewer('map', {
        terrainProvider: await Cesium.createWorldTerrainAsync(), 
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false
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

    const initialPosition = Cesium.Cartesian3.fromDegrees(0.0, 42.76, 10000);
    viewer.camera.flyTo({
        destination: initialPosition,
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-50),
            roll: 0.0
        },
        duration: 1
    });

    viewer.screenSpaceEventHandler.setInputAction((click: any) => {
        const ray = viewer.camera.getPickRay(click.position);
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene);

        if (cartesian) {
            viewer.entities.add({
                position: cartesian,
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
                label: {
                    text: 'MA VILLE',
                    font: 'bold 25px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 3,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -10),
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                    eyeOffset: new Cesium.Cartesian3(0, 0, -100), 
                    scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 100000, 0.9)
                }
            });
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

initMap();
