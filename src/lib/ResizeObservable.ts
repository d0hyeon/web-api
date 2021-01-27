
interface ResizeObserverMethods {
  observe(target: Element): void;
  unobserve(target: Element): void;
  disconnect(): void;
}

interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
}

declare var ResizeObserver: {
  prototype: ResizeObserverMethods;
  new(callback: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void): ResizeObserverMethods;
}

interface DOMRectReadOnly {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

type ResizeObservableCallback = (contentRect: DOMRectReadOnly) => void;

export interface ResizeObservableInterface {
  register: (target: HTMLElement, callback: ResizeObservableCallback) => void;
  unregister: (target: HTMLElement) => void;
  disconnect(): void;
}

type RegisteredMap = Map<Element, ResizeObservableCallback[]>;

class ResizeObservable {
  private observer: null | ResizeObserver = null;
  private collection: RegisteredMap = new Map(); 
  private entryCallback = (entries: ResizeObserverEntry[]) => {
    for(const entry of entries) {
      if(this.collection.has(entry.target)) {
        const callbacks = this.collection.get(entry.target);
        callbacks?.forEach((callback) => {
          callback(entry.contentRect);
        });
      }
    }
  }
  constructor () {
    if(!this.observer) {
      if(!('ResizeObserver' in window)) {
        import('resize-observer-polyfill').then(module => {
          const ResizeObserver = module.default;
          this.observer = new ResizeObserver(this.entryCallback);
        })
      } else {
        this.observer = new ResizeObserver(this.entryCallback);
      }
    }
  }
  register (target: Element, callback: ResizeObservableCallback) {
    if(!this.observer) {
      return setTimeout(() => {
        this.register(target, callback)
      }, 100)
    }
    if(this.collection.has(target)) {
      const callbacks = this.collection.get(target);
      this.collection.set(target, [...callbacks as ResizeObservableCallback[], callback]);
    } else {
      this.collection.set(target, [callback]);
      this.observer?.observe(target);
    }
  }
  unregister(target: Element) {
    this.collection.delete(target);
    this.observer?.unobserve(target);
  }
  disconnect() {
    this.collection.clear();
    this.observer?.disconnect();
  }
}

export default ResizeObservable;