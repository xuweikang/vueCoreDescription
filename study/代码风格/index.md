1. 判断新旧值是否相同（不要漏掉NaN）
  ```js
  if (val === newVal || (newVal !== newVal && val !== val))
  ```
  
  2. 设置一个永不相等条件判断
  
  ```js
  // 这样每次执行func都会重置counter为0和1
    let counter = 1
    function func() {
        counter = (counter + 1) % 2
    }
  ```