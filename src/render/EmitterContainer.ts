import { Emitter, EmitterRenderer, halfPI, ObjectPool, Particle, rgbToNumber } from '@armathai/quark-core';
import { Renderer, Texture } from '@pixi/core';
import { Container, IDestroyOptions } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { Ticker } from '@pixi/ticker';

export class EmitterContainer extends Container implements EmitterRenderer {
    private _spritePool: ObjectPool<Sprite>;
    private _particleSpriteMap: Map<Particle, Sprite> = new Map();
    private _emitters: Emitter[];

    public constructor(emitters: Emitter[]) {
        super();
        this._spritePool = new ObjectPool<Sprite>(this._spriteFactory, this._resetSprite);
        this._emitters = emitters;
        this._emitters.forEach((e) => (e.renderer = this));
    }

    public prewarm(time: number): void {
        this._emitters.forEach((e) => e.prewarm(time, Ticker.shared.deltaMS / 1000));
    }

    /**
     * Renders the container using the WebGL renderer
     *
     * @private
     * @param {PIXI.Renderer} renderer - The webgl renderer
     */
    public render(renderer: Renderer): void {
        super.render(renderer);
        this._emitters.forEach((e) => {
            if (!e.paused) {
                e.update(Ticker.shared.deltaMS / 1000);
                e.particles.forEach((p) => {
                    this.renderParticle(p);
                });
            }
        });
    }

    public destroy(options?: IDestroyOptions | boolean): void {
        this._emitters.forEach((e) => e.destroy());
        super.destroy(options);
    }

    public destroyParticle(particle: Particle): void {
        const sprite = this._particleSpriteMap.get(particle);
        this.removeChild(sprite);
        this._spritePool.releaseObject(sprite);
        this._particleSpriteMap.delete(particle);
    }

    public createParticle(particle: Particle): void {
        const sprite = this._createSprite(<Texture>particle.appearance);
        sprite.blendMode = particle.blendMode;
        this._particleSpriteMap.set(particle, sprite);
        this.addChild(sprite);
    }

    public renderParticle(particle: Particle): void {
        const { effect, position, appearance } = particle;
        const { color, alpha, scale, rotation } = effect;
        const sprite = this._particleSpriteMap.get(particle);
        sprite.texture = <Texture>appearance;
        sprite.x = position.x;
        sprite.y = position.y;
        sprite.alpha = alpha;
        sprite.scale.x = scale;
        sprite.scale.y = scale;
        particle.radius = Math.max(sprite.width, sprite.height) / 2;
        sprite.rotation = rotation * halfPI;
        sprite.tint = rgbToNumber(color);
    }

    private _createSprite(texture: Texture): Sprite {
        const sprite = this._spritePool.getObject();
        sprite.texture = texture;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        return sprite;
    }

    private _resetSprite = (sprite: Sprite): Sprite => {
        return sprite;
    };

    private _spriteFactory = (): Sprite => {
        const s = new Sprite();
        return s;
    };
}
