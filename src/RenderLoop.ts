export class RenderLoop {
    msLastFrame: number;
    fps: number = 0;
    isActive: boolean;
    run: () => void;

    constructor(public callBack: (deltaTime: number) => void, public fpsLimit = 0) {
        this.msLastFrame = -1;
        this.isActive = true;

        if (this.fpsLimit > 0) {
            const msFpsLimit = 1000.0/this.fpsLimit;

            this.run = () => {
                const msCurrent = performance.now(),
                    msDelta = (msCurrent - this.msLastFrame),
                    deltaTime = msDelta / 1000.0;
 
                if (msDelta >= msFpsLimit) {
                    this.fps = Math.floor(1/deltaTime);
                    this.msLastFrame = msCurrent;
                    this.callBack(deltaTime);
                }

                if (this.isActive) requestAnimationFrame(this.run);
            };

            return;
        }

        this.run = () => {
            const msCurrent = performance.now(),
                deltaTime = (msCurrent - this.msLastFrame) / 1000.0;

            this.fps = Math.floor(1/deltaTime);
            this.msLastFrame = msCurrent;

            this.callBack(deltaTime);
            if (this.isActive) requestAnimationFrame(this.run);
        };
    }

    start() {
        this.isActive = true;
        this.msLastFrame = performance.now();
        requestAnimationFrame(this.run);
        return this;
    }

    stop() {
        this.isActive = false;
    }
}
