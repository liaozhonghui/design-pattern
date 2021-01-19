class Node {
  // 双端链表节点
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null
  }
}
class DoubleLinkedList {
  constructor() {
    this.head = new Node(-1);
  }
  get() {
    return this.head.next;
  }
  _delete(node) {
    // 删除节点
    let prev = node.prev;
    let next = node.next;
    prev.next = next;
    if (next) next.prev = prev;
  }
  _insertHead(node) {
    // 插入头部
    let head = this.head;
    node.next = head.next;
    if (head.next) head.next.prev = node
    head.next = node;
    node.prev = head;
  }

  _deleteTail() {
    let tail = this.head;
    while (tail.next) tail = tail.next;
    tail.prev.next = null;
    tail.prev = null;
    return tail;
  }
  _traverse() {
    let p = this.head.next;
    let str = '节点列表：'
    while (p) {
      str += '\t' + p.value.value;
      p = p.next;
    }
    return str;
  }
}

class LruCache {
  constructor(cap) {
    this.cap = cap;
    this.cache = new DoubleLinkedList();
    this.map = new Map();
  }

  put(key, e) {
    if (this.map.get(key)) {
      this.cache._delete(this.map.get(key));
      this.map.delete(key)
    } else {
      // 容量满了， 删除末尾元素
      if (this.map.size === this.cap) {
        let tail = this.cache._deleteTail();
        this.map.delete(tail.value.key);
      }
    }
    let node = new Node({ key: key, value: e });
    this.cache._insertHead(node);
    this.map.set(key, node);
  }
  get(key) {
    let node = this.map.get(key);
    if (!node) return null;
    this.cache._delete(node);
    this.cache._insertHead(node);
    return node.value;
  }
  toString() {
    return this.cache._traverse();
  }
}
// test cases;
let lruCache = new LruCache(4);
lruCache.put(1, 1);
lruCache.put(2, 2);
lruCache.put(3, 3);
lruCache.put(4, 4);
console.log(lruCache.toString());
lruCache.put(1, 10);
lruCache.put(2, 20);
console.log(lruCache.toString());
lruCache.put(5, 5);
lruCache.put(6, 6);
console.log(lruCache.toString());
