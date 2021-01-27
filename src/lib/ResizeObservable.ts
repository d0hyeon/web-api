import ResizeObserver from 'resize-observer-polyfill';

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

type ResizeObserverCallback = (contentRect: DOMRectReadOnly) => void;

export interface ResizeObservableInterface {
  register: (target: HTMLElement, callback: ResizeObserverCallback) => void;
  unregister: (target: HTMLElement) => void;
  disconnect(): void;
}

type RegisteredMap = Map<Element, ResizeObserverCallback[]>;

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
      this.observer = new ResizeObserver(this.entryCallback);
    }
  }
  register (target: Element, callback: ResizeObserverCallback) {
    if(this.collection.has(target)) {
      const callbacks = this.collection.get(target);
      this.collection.set(target, [...callbacks as ResizeObserverCallback[], callback]);
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