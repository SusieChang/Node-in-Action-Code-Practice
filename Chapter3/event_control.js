function add (value) {
	return value+1;
}
function* longRunningTask(value1) {
  try {
    var value2 = yield add(value1);
    var value3 = yield add(value2);
    var value4 = yield add(value3);
    var value5 = yield add(value4);
  } catch (e) {
    //handle error
  }
}
function scheduler(task) {
  var taskObj = task.next(task.value);
  if(!taskObj.done) {
    task.value = taskObj.value;
    scheduler(task);
  }
}
scheduler(longRunningTask(5));

function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}