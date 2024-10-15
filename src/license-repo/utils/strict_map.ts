export class StrictMap<K, V> extends Map<K, V> {
  get(key: K): V {
    if (!this.has(key)) {
      throw new Error(`Key '${String(key)}' not found.`);
    }
    return super.get(key)!;
  }
}
