import { observer } from 'mobx-react-lite';
import GameStore from '../GameStore';
import './scss/Game.scss';
import { useEffect, useRef } from 'react';
import loadTextures from "./loadTextures";
import { Application, Sprite, Text, TextStyle, Container } from './pixi';
import { numPrettier } from '../GameUtils';

export default observer(({ hide = false }) => {
    const pixiScene = useRef(null);
    useEffect(() => {
        console.log(hide);

    }, [hide])
    useEffect(() => {
        let app;
        app = new Application();

        const initGame = async () => {
            const textures = await loadTextures();
            await app.init({ backgroundAlpha: 0, resizeTo: window });
            const w = app.screen.width;
            const h = app.screen.height;
            if (!pixiScene.current) return;
            pixiScene.current.appendChild(app.canvas);

            const objW = h < w ? h / 1.5 : w / 1.5;
            const originalHeight = objW;
            const originalWidth = objW;

            // Создаём shine 1
            const shine1 = Sprite.from(textures.shine);
            shine1.anchor.set(0.5, 0.5);
            shine1.x = w / 2;
            shine1.y = h / 2;
            shine1.width = objW * 1.4;
            shine1.height = objW * 1.4;
            shine1.alpha = .2;
            app.stage.addChild(shine1);

            // Создаём shine 2
            const shine2 = Sprite.from(textures.shine);
            shine2.anchor.set(0.5, 0.5);
            shine2.x = w / 2;
            shine2.y = h / 2;
            shine2.width = objW * 1.4;
            shine2.height = objW * 1.4;
            shine2.alpha = .1;
            app.stage.addChild(shine2);

            // Анимация вращения shine
            app.ticker.add(() => {
                shine1.rotation += 0.005;
                shine2.rotation -= 0.002;
            });


            // Создаём buko
            const buko = Sprite.from(textures.buko);
            buko.label = 'buko';
            buko.anchor.set(0.5, 0.5);
            buko.x = w / 2;
            buko.y = h / 2;
            buko.width = objW;
            buko.height = objW;
            app.stage.addChild(buko);


            const animateBuko = () => {
                let scale = 1;
                let direction = -0.05; // Уменьшение размера
                const randomRotation = (Math.random() - 0.5) * Math.PI * 0.2; // Случайный угол поворота (от -0.1 до 0.1 радиан)
                const randomOffsetX = (Math.random() - 0.5) * 20; // Случайное смещение по X (от -10 до 10 пикселей)
                const randomOffsetY = (Math.random() - 0.5) * 20; // Случайное смещение по Y (от -10 до 10 пикселей)

                let elapsed = 0; // Время для easing
                const duration = 30; // Длительность анимации в кадрах

                const ticker = app.ticker.add(() => {
                    elapsed += 1;

                    // Вычисляем easing (сглаживание)
                    const progress = Math.min(elapsed / duration, 1); // Прогресс от 0 до 1
                    const easing = Math.sin(progress * Math.PI); // Сглаживание через синус

                    // Применяем эффекты
                    buko.width = originalWidth * (1 + easing * direction);
                    buko.height = originalHeight * (1 + easing * direction);
                    buko.rotation = randomRotation * easing;
                    buko.x = w / 2 + randomOffsetX * easing;
                    buko.y = h / 2 + randomOffsetY * easing;

                    // Завершаем анимацию
                    if (progress >= 1) {
                        // Сбрасываем в начальное состояние
                        buko.width = originalWidth;
                        buko.height = originalHeight;
                        buko.rotation = 0;
                        buko.x = w / 2;
                        buko.y = h / 2;
                        app.ticker.remove(ticker);
                    }
                });
            };

            // Функция анимации числа и картинки
            const animateNumberAndIcon = (x, y, bpc) => {
                const container = new Container();
                app.stage.addChild(container);

                // Создаём текст "1"
                const number = new Text({
                    text: `+${bpc}`, style: {
                        fontFamily: 'Merriweather', // Название шрифта
                        fill: '#ffffff',
                        fontWeight: 'bold',
                        dropShadow: true,
                        dropShadowColor: '#000',
                        dropShadowAlpha: 0.8,
                        dropShadowDistance: 0,
                        dropShadowBlur: 4,
                        fontSize: 24
                    }
                });
                number.anchor.set(0, 0.5);

                console.log(number.style);

                // Создаём картинку
                const icon = Sprite.from(textures.bukoPix);
                icon.anchor.set(0.5, 0.5);
                icon.width = 40;
                icon.height = 40;

                // Расположение контейнера
                container.x = x;
                container.y = y;

                // Добавляем элементы в контейнер
                container.addChild(icon);
                container.addChild(number);

                // Расположение иконки и текста
                icon.x = 0;
                number.x = 24;

                let alpha = 1; // Начальная прозрачность
                const speed = 2; // Скорость движения вверх

                const ticker = app.ticker.add(() => {
                    if (!container || container.destroyed) {
                        app.ticker.remove(ticker);
                        return;
                    }

                    container.y -= speed; // Движение вверх
                    alpha -= 0.01; // Постепенное исчезновение
                    container.alpha = alpha;

                    if (alpha <= 0) {
                        app.ticker.remove(ticker); // Удаляем обработчик
                        app.stage.removeChild(container);
                        container.destroy({ children: true }); // Уничтожаем контейнер
                    }
                });
            };

            // Обработчик кликов
            buko.interactive = true;
            buko.on('pointerdown', (event) => {
                const { x, y } = event.data.global; // Координаты клика
                const bpc = numPrettier(GameStore.tap()); // Логика для обработки тапа
                animateNumberAndIcon(x, y, bpc);
                animateBuko(); // Анимация buko
            });
        };

        initGame();

        return () => {
            if (app) {
                try {
                    app.destroy(true, { children: true, texture: true, baseTexture: true });
                } catch (error) {
                    console.log('Cant destroy');
                }
            }
            if (pixiScene.current) {
                pixiScene.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className='Game_wrapper' style={{
            opacity: hide ? 0 : 1,
            height: hide ? 0 : 'auto',
        }}>
            <div className='Game' ref={pixiScene}></div>
        </div>
    );
});
