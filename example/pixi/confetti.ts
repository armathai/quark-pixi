/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Application, Texture } from 'pixi.js';
import Stats from 'stats.js';
import {
    AppearanceMeasure,
    Emitter,
    EmitterContainer,
    GravityEffect,
    LifeMeasure,
    MassMeasure,
    PolarVelocityMeasure,
    RangeValue,
    Rate,
    RotationEffect,
} from '../../src';
//@ts-ignore
import particle1 from '../image/confetti/01.png';
//@ts-ignore
import particle2 from '../image/confetti/02.png';
//@ts-ignore
import particle3 from '../image/confetti/03.png';
//@ts-ignore
import particle4 from '../image/confetti/04.png';
//@ts-ignore
import particle5 from '../image/confetti/05.png';
//@ts-ignore
import particle6 from '../image/confetti/06.png';

const canvas = <HTMLCanvasElement>document.getElementById('testCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const app = new Application({ view: canvas, resizeTo: window });
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const configs = [
    {
        angular: 45,
        x: -canvas.width / 2,
    },
    {
        angular: -45,
        x: canvas.width / 2,
    },
];

const emitters = Array.from({ length: 2 }).map((_, i) => {
    const emitter = new Emitter(undefined, 20);
    emitter.rate = new Rate(new RangeValue(1, 5), 0.03);

    const config = configs[i];
    const { angular, x } = config;

    emitter.addMeasure(new MassMeasure(1));
    emitter.addMeasure(new LifeMeasure(5));
    emitter.addMeasure(
        new AppearanceMeasure([
            Texture.from(particle1),
            Texture.from(particle2),
            Texture.from(particle3),
            Texture.from(particle4),
            Texture.from(particle5),
            Texture.from(particle6),
        ]),
    );
    emitter.addMeasure(new PolarVelocityMeasure(new RangeValue(5, 7), new RangeValue(angular - 20, angular + 20)));

    emitter.addEffect(new GravityEffect(5));
    emitter.addEffect(new RotationEffect(new RangeValue(-5, 5), new RangeValue(-5, 5)));
    emitter.position.x = x;
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
