var _ = require('lodash');

var projectMap = {
  'a': 100,
  'b': 100,
  'c': 100,
};
var BaseCount = 3;
var sum = 0;
_.each(_.keys(projectMap), (k, index, list) => {
  if (index < list.length - 1) {
    projectMap[k] = Math.round(projectMap[k] / BaseCount);
    sum += projectMap[k];
  } else {
    projectMap[k] = 100 - sum;
  }
});
console.log('projectMap:', projectMap);
