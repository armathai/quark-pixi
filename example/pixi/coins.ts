/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Application, Texture } from 'pixi.js';
import Stats from 'stats.js';
import {
    AnimationEffect,
    easeInQuad,
    Emitter,
    EmitterContainer,
    GravityEffect,
    LifeMeasure,
    MassMeasure,
    PolarVelocityMeasure,
    RangeValue,
    Rate,
    RotationEffect,
    ScaleEffect,
} from '../../src';
//@ts-ignore
import coin1 from '../image/coins/coin_01.png';
//@ts-ignore
import coin2 from '../image/coins/coin_02.png';
//@ts-ignore
import coin3 from '../image/coins/coin_03.png';
//@ts-ignore
import coin4 from '../image/coins/coin_04.png';
//@ts-ignore
import coin5 from '../image/coins/coin_05.png';
//@ts-ignore
import coin6 from '../image/coins/coin_06.png';
//@ts-ignore
import coin7 from '../image/coins/coin_07.png';

const canvas = <HTMLCanvasElement>document.getElementById('testCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const app = new Application({ view: canvas, resizeTo: window });
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const emitters = Array.from({ length: 1 }).map((_, i) => {
    const emitter = new Emitter();
    emitter.rate = new Rate(new RangeValue(5, 10), new RangeValue(0.1, 0.15));
    // emitter.rate = new Rate(1, 10);

    emitter.addMeasure(new MassMeasure(1));
    emitter.addMeasure(new LifeMeasure(5));
    // emitter.addMeasure(new AppearanceMeasure(Texture.from(coin1)));
    emitter.addMeasure(new PolarVelocityMeasure(new RangeValue(3, 5), new RangeValue(-30, 30)));
    // emitter.addMeasure(new PositionOnMeasure(new LineZone(-200, 0, 200, 0)));

    emitter.addEffect(
        new AnimationEffect(
            [
                Texture.from(coin1),
                Texture.from(coin2),
                Texture.from(coin3),
                Texture.from(coin4),
                Texture.from(coin5),
                Texture.from(coin6),
                Texture.from(coin7),
            ],
            24,
        ),
    );
    emitter.addEffect(new RotationEffect(new RangeValue(-10, 10)));
    emitter.addEffect(new ScaleEffect(0, 2, undefined, easeInQuad));
    emitter.addEffect(new GravityEffect(3));
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
