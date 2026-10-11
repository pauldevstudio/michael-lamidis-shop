import { test } from "node:test";
import assert from "node:assert/strict";
import { inStockFirst } from "../lib/product-order.ts";

const ids = (list) => list.map((p) => p.id);

test("puts in-stock products first and sold ones last", () => {
  const list = [
    { id: "a", sold: true },
    { id: "b", sold: false },
    { id: "c", sold: true },
    { id: "d", sold: false },
  ];
  assert.deepEqual(ids(inStockFirst(list)), ["b", "d", "a", "c"]);
});

test("keeps the given order inside each group", () => {
  const list = [
    { id: "s1", sold: true },
    { id: "i1" },
    { id: "s2", sold: true },
    { id: "i2" },
    { id: "i3" },
    { id: "s3", sold: true },
  ];
  assert.deepEqual(ids(inStockFirst(list)), ["i1", "i2", "i3", "s1", "s2", "s3"]);
});

test("treats a product with no sold flag as in stock", () => {
  const list = [{ id: "a", sold: true }, { id: "b" }, { id: "c", sold: undefined }];
  assert.deepEqual(ids(inStockFirst(list)), ["b", "c", "a"]);
});

test("leaves a list with nothing sold, or everything sold, as it was", () => {
  assert.deepEqual(ids(inStockFirst([{ id: "a" }, { id: "b" }])), ["a", "b"]);
  assert.deepEqual(ids(inStockFirst([{ id: "a", sold: true }, { id: "b", sold: true }])), ["a", "b"]);
  assert.deepEqual(inStockFirst([]), []);
});

test("returns a new list and does not change the one passed in", () => {
  const list = [{ id: "a", sold: true }, { id: "b" }];
  const result = inStockFirst(list);
  assert.notEqual(result, list);
  assert.deepEqual(ids(list), ["a", "b"]);
});

test("a featured slice holds no sold product while enough are in stock", () => {
  const list = [
    { id: "s1", sold: true },
    { id: "i1" },
    { id: "s2", sold: true },
    { id: "i2" },
    { id: "i3" },
  ];
  assert.deepEqual(ids(inStockFirst(list).slice(0, 3)), ["i1", "i2", "i3"]);
  // Only when in-stock ones run out does a sold product fill the slice.
  assert.deepEqual(ids(inStockFirst(list).slice(0, 4)), ["i1", "i2", "i3", "s1"]);
});
