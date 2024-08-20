const MILLIS_PER_SEC = 1000;
const DEFAULT_REPORTING_INTERVAL_MS = 100;
const DEFAULT_SAMPLING_INTERVAL_MS = 3000;

type FpsReporterCallback = (fps: number) => void;

export class FpsReporter {
  private ticks: number[] = [];
  private lastReport = 0;
  private startTime = 0;

  constructor(
    private fn: FpsReporterCallback,
    private reportInterval = DEFAULT_REPORTING_INTERVAL_MS,
    private sampleInterval = DEFAULT_SAMPLING_INTERVAL_MS,
  ) {}

  tick() {
    // Ignore first tick to setup.
    if (this.startTime === 0) {
      this.reset();
      return;
    }

    const nowTime = performance.now();
    this.ticks.push(nowTime);

    if (nowTime >= this.lastReport + this.reportInterval) {
      this.lastReport = nowTime;
      this.ticks = this.ticks.filter((t) => t >= nowTime - this.sampleInterval);

      const duration =
        nowTime - this.startTime < this.sampleInterval
          ? nowTime - this.startTime
          : this.sampleInterval;

      const fps = (this.ticks.length / duration) * MILLIS_PER_SEC;
      this.fn(fps);
    }
  }

  reset() {
    this.ticks = [];
    const nowTime = performance.now();
    this.startTime = nowTime;
    this.lastReport = nowTime;
  }
}
