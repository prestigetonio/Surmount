import * as Cesium from 'cesium';

type OnConfirm = (cartesian: Cesium.Cartesian3, name: string) => void;

let pendingCartesian: Cesium.Cartesian3 | null = null;

const overlay    = () => document.getElementById('modal-overlay')!;
const input      = () => document.getElementById('point-name') as HTMLInputElement;
const btnConfirm = () => document.getElementById('btn-confirm')!;
const btnCancel  = () => document.getElementById('btn-cancel')!;

function open(cartesian: Cesium.Cartesian3): void {
    pendingCartesian = cartesian;
    input().value = '';
    overlay().classList.add('visible');
    setTimeout(() => input().focus(), 200);
}

function close(): void {
    overlay().classList.remove('visible');
    pendingCartesian = null;
}

export function initModal(onConfirm: OnConfirm): void {
    btnConfirm().addEventListener('click', () => {
        if (pendingCartesian) onConfirm(pendingCartesian, input().value);
        close();
    });

    btnCancel().addEventListener('click', close);

    input().addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' && pendingCartesian) {
            onConfirm(pendingCartesian, input().value);
            close();
        } else if (e.key === 'Escape') {
            close();
        }
    });

    overlay().addEventListener('click', (e: MouseEvent) => {
        if (e.target === overlay()) close();
    });
}

export { open as openModal };
