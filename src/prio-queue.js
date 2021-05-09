import sortedIndexBy from 'lodash.sortedindexby';

// Very naive small priority queue
export function PrioQueue(size, getRank) {
    let items = [];

    this.add = item => {
        const i = sortedIndexBy(items, item, getRank);
        if (i < size) {
            items = [...items.slice(0, i), item, ...items.slice(i, size - 1)];
        }
    }

    this.get = () => items;
}