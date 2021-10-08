/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Application, Texture } from 'pixi.js';
import Stats from 'stats.js';
import {
    AlphaEffect,
    AppearanceMeasure,
    BlendModeMeasure,
    ColorEffect,
    Emitter,
    EmitterContainer,
    LifeMeasure,
    MassMeasure,
    PolarVelocityMeasure,
    RangeValue,
    Rate,
    ScaleEffect,
} from '../../src';
//@ts-ignore
import particle from '../image/particle.png';

const canvas = <HTMLCanvasElement>document.getElementById('testCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const app = new Application({ view: canvas, resizeTo: window });
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const emitters = Array.from({ length: 1 }).map(() => {
    const emitter = new Emitter();
    emitter.rate = new Rate(new RangeValue(5, 10), new RangeValue(0.01, 0.015));

    emitter.addMeasure(new MassMeasure(1));
    emitter.addMeasure(new LifeMeasure(1, 2));
    emitter.addMeasure(new BlendModeMeasure(BlendModeMeasure.add));
    emitter.addMeasure(new AppearanceMeasure(Texture.from(particle)));
    emitter.addMeasure(new PolarVelocityMeasure(new RangeValue(1, 3, true), 65));

    emitter.addEffect(new AlphaEffect(1, 0));
    emitter.addEffect(new ColorEffect(0x4f1500, 0x0029ff));
    emitter.addEffect(new ScaleEffect(3, 0.1));
    // const emitterContainer = new EmitterContainer(emitter);
    // app.stage.addChild(emitterContainer);
    return emitter;
});

// emitter.addEffect(new CrossZone(new RectZone(0, 0, canvas.width, canvas.height)));

const emitterContainer = new EmitterContainer(emitters);
emitterContainer.x = canvas.width / 2;
emitterContainer.y = canvas.height / 2;
app.stage.addChild(emitterContainer);

app.ticker.add(() => {
    stats.update();
});
//@ts-ignore
window.emitters = emitters;
