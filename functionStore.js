function flipMap(originalMap) {
  const flippedMap = new Map();

  originalMap.forEach((innerMap, y) => {
    innerMap.forEach((value, x) => {
      if (!flippedMap.has(x)) {
        flippedMap.set(x, new Map());
      }
      flippedMap.get(x).set(y, value);
    });
  });

  return flippedMap;
}
