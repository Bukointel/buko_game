import { Assets } from './pixi.js';

const loadTextures = async () => {
    const textures = {}
    textures.buko = await Assets.load(`/img/playLarge.png`);
    textures.shine = await Assets.load(`/img/shine.png`);
    textures.paw = await Assets.load(`/img/paw.png`);
    textures.bukoPix = await Assets.load(`/img/bukoPix.png`);


    Assets.addBundle('fonts', [
        { alias: 'Merriweather', src: '/fonts/Merriweather-Regular.ttf' },
    ]);

    // Load the font bundle
    await Assets.loadBundle('fonts');

    return textures
}

export default loadTextures
