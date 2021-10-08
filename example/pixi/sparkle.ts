/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Application, NineSlicePlane, Texture } from 'pixi.js';
import Stats from 'stats.js';
import {
    AlphaEffect,
    AppearanceMeasure,
    Emitter,
    EmitterContainer,
    LifeMeasure,
    MassMeasure,
    PolarVelocityMeasure,
    PositionOnMeasure,
    RangeValue,
    Rate,
    RectZone,
    RotationEffect,
    VelocityZoneEffect,
    VelocityZoneVectorType,
} from '../../src';
//@ts-ignore
import btn_orange from '../image/btn_orange.png';
//@ts-ignore
import particle from '../image/fx_star.png';

const canvas = <HTMLCanvasElement>document.getElementById('testCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const app = new Application({ view: canvas, resizeTo: window });
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const emitters = Array.from({ length: 1 }).map((_, i) => {
    const emitter = new Emitter();
    emitter.rate = new Rate(new RangeValue(1, 2), new RangeValue(0.05, 0.01));
    const zone = new RectZone(-440 / 2, -80 / 2, 440, 80);
    // const zone = new CircleZone(0, 0, 100);

    emitter.addMeasure(new MassMeasure(1));
    emitter.addMeasure(new LifeMeasure(0.5, 1));
    emitter.addMeasure(new AppearanceMeasure(Texture.from(particle)));
    emitter.addMeasure(new PolarVelocityMeasure(new RangeValue(0.5, 1), new RangeValue(0, 360)));
    emitter.addMeasure(new PositionOnMeasure(zone));

    emitter.addEffect(new AlphaEffect(1, 0));
    // emitter.addEffect(new RepulsionEffect(new Vector2D(0, 0), 2, 200));
    emitter.addEffect(new VelocityZoneEffect(zone, VelocityZoneVectorType.spread));
    emitter.addEffect(new RotationEffect(new RangeValue(-2, 2)));
    // emitter.addEffect(new ScaleEffect(new RangeValue(1, 1), 0, undefined, easeOutCirc));
    // emitter.addEffect(new CrossZoneEffect(zone));

    // const emitterContainer = new EmitterContainer(emitter);
    emitter.position.x = 0;
    emitter.position.y = 0 + i * 100;
    // app.stage.addChild(emitterContainer);
    return emitter;
});

// emitter.addEffect(new CrossZone(new RectZone(0, 0, canvas.width, canvas.height)));

const emitterContainer = new EmitterContainer(emitters);
emitterContainer.x = canvas.width / 2;
emitterContainer.y = canvas.height / 2;
app.stage.addChild(emitterContainer);

const button = new NineSlicePlane(Texture.from(btn_orange), 30, 30, 30, 30);
button.width = 460;
button.height = 100;
button.x = (canvas.width - button.width) / 2;
button.y = (canvas.height - button.height) / 2;
app.stage.addChild(button);

app.ticker.add(() => {
    stats.update();
});
//@ts-ignore
window.emitters = emitters;
