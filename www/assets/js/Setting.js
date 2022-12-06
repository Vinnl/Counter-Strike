import {Action} from "./Enums.js";

export class Setting {
    #setting = {
        base: {
            fov: 70,
            volume: 30,
            radarZoom: 0.9,
            sensitivity: 1.0,
            sprayTriggerDeltaMs: 80,
            crosshair: '✛',
            crosshairColor: 'd31b1b',
            preferPerformance: false,
            anisotropic: 16,
            exposure: 0.8,
        },
        bind: {
            'KeyW': Action.MOVE_FORWARD,
            'KeyA': Action.MOVE_LEFT,
            'KeyS': Action.MOVE_BACK,
            'KeyD': Action.MOVE_RIGHT,
            'KeyE': Action.USE,
            'Space': Action.JUMP,
            'ControlLeft': Action.CROUCH,
            'ShiftLeft': Action.WALK,
            'KeyR': Action.RELOAD,
            'KeyG': Action.DROP,
            'KeyQ': Action.EQUIP_KNIFE,
            'Digit1': Action.EQUIP_PRIMARY,
            'Digit2': Action.EQUIP_SECONDARY,
            'Digit5': Action.EQUIP_BOMB,
            'KeyB': Action.BUY_MENU,
            'Tab': Action.SCORE_BOARD,
        },
    }

    constructor(settingString = null) {
        if (settingString) {
            this.loadSettings(JSON.parse(settingString))
        }
    }

    loadSettings(settingObject) {
        this.#setting = settingObject
    }

    getSetting() {
        return JSON.parse(JSON.stringify(this.#setting))
    }

    getBinds() {
        return this.#setting.bind
    }

    getSprayTriggerDeltaMs() {
        return this.#setting.base.sprayTriggerDeltaMs || 80
    }

    getRadarZoom() {
        return this.#setting.base.radarZoom || 0.9
    }

    getFieldOfView() {
        return this.#setting.base.fov || 70
    }

    getAnisotropicFiltering() {
        if (this.shouldPreferPerformance()) {
            return 1
        }
        return this.#setting.base.anisotropic || 16
    }

    shouldPreferPerformance() {
        return this.#setting.base.preferPerformance || false
    }

    getSensitivity() {
        return this.#setting.base.sensitivity || 1.0
    }

    getExposure() {
        return this.#setting.base.exposure || 0.8
    }

    getMasterVolume() {
        return this.#setting.base.volume || 30
    }

    getCrosshairSymbol() {
        return this.#setting.base.crosshair || '+'
    }

    getCrosshairColor() {
        return this.#setting.base.crosshairColor || 'd31b1b'
    }

}
