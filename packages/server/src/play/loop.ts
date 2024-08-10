export type TickFunction = (time: number, frame: number) => void;
type InternalTickHandler = () => void;

export abstract class Looper {
  private playtime = 0;
  private frames = 0;
  constructor(private fn: TickFunction) {}

  start(): void {
    const startTime = performance.now();
    this.scheduleNextTick(() => {
      const dt = performance.now() - startTime;
      this.frames += 1;
      this.playtime += dt;
      this.fn(this.playtime, this.frames);

      this.start();
    });
  }

  stop(): void {
    this.cancelNextTick();
  }

  reset(): void {
    this.stop();
    this.playtime = 0;
    this.frames = 0;
  }

  protected abstract scheduleNextTick(handleTick: InternalTickHandler): void;
  protected abstract cancelNextTick(): void;
}

export class FixedLooper extends Looper {
  private handle: number | NodeJS.Timeout = 0;
  constructor(
    fn: TickFunction,
    private interval_ms: number,
  ) {
    super(fn);
  }
  protected scheduleNextTick(handleTick: InternalTickHandler): void {
    this.handle = setTimeout(() => {
      handleTick();
    }, this.interval_ms);
  }
  protected cancelNextTick(): void {
    if (this.handle) {
      clearTimeout(this.handle);
      this.handle = 0;
    }
  }
}

export class RequestAnimationFrameLooper extends Looper {
  private handle = 0;
  protected scheduleNextTick(handleTick: InternalTickHandler): void {
    this.handle = requestAnimationFrame(() => {
      handleTick();
    });
  }
  protected cancelNextTick(): void {
    if (this.handle) {
      cancelAnimationFrame(this.handle);
      this.handle = 0;
    }
  }
}
