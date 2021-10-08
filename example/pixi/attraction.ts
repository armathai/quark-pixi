/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Application, Texture } from 'pixi.js';
import Stats from 'stats.js';
import {
    AlphaEffect,
    AppearanceMeasure,
    AttractionEffect,
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
    Vector2D,
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

const emitters = Array.from({ length: 1 }).map((_, i) => {
    const emitter = new Emitter();
    emitter.rate = new Rate(new RangeValue(30, 50), 0.1);

    emitter.addMeasure(new MassMeasure(1));
    emitter.addMeasure(new LifeMeasure(1, 1.7));
    emitter.addMeasure(new BlendModeMeasure(BlendModeMeasure.add));
    emitter.addMeasure(new AppearanceMeasure(Texture.from(particle)));
    emitter.addMeasure(new PolarVelocityMeasure(new RangeValue(3, 5), new RangeValue(0, 360)));

    emitter.addEffect(new AlphaEffect(1, 0.2));
    emitter.addEffect(new ColorEffect(0xff0000, 0xffff00));
    emitter.addEffect(new ScaleEffect(new RangeValue(1 * 2, 1.6 * 2), new RangeValue(0, 0.1 * 2)));
    emitter.addEffect(new AttractionEffect(new Vector2D(0, 0), 10, 200));
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
