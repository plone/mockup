/**
 * TinyMCE version 6.8.3 (2024-02-08)
 * Extracted from tinymce/plugins/help/plugin.js
 */


export class Cell {
    constructor(initial) {
      this.value = initial;
      this.get = () => this.value;
      this.set = v => this.value = v;
    }
  }



const isNullable = (a) => a === null || a === undefined;
const isNonNullable = (a) => !isNullable(a);

export class Optional {
    constructor(tag, value) {
        this.tag = tag;
        this.value = value;
    }
    static some(value) {
        return new Optional(true, value);
    }
    static none() {
        return Optional.singletonNone;
    }
    fold(onNone, onSome) {
        if (this.tag) {
            return onSome(this.value);
        } else {
            return onNone();
        }
    }
    static from(value) {
        return isNonNullable(value) ? this.some(value) : this.none();
    }
    each(worker) {
        if (this.tag) {
            worker(this.value);
        }
    }
}
