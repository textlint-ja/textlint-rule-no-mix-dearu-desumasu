// LICENSE : MIT
"use strict";
/**
 * 無視する範囲を管理するライブラリ
 */
export default class IgnoreManger {
    constructor() {
        this._ignoredRangeList = []
    }

    isIgnoredIndex(index) {
        return this._ignoredRangeList.some(range => {
            const [start, end] = range;
            return start <= index && index <= end;
        })
    }

    isIgnored(node) {
        const index = node.index;
        return this._ignoredRangeList.some(range => {
            const [start, end] =range;
            return start <= index && index <= end;
        })
    }

    addNode(node) {
        this._ignoredRangeList.push(node.range);
    }
}