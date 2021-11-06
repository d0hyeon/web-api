export const isExistWithInTimeout = <T = unknown>(value: T, timeout: number = 3000, repeatUnit: number = 300): Promise<T | null> => {
  let durationTime = 0;

  return new Promise((resolve, reject) => {
    const recursiveCheck = (startTime: number) => {
      if(value) {
        if(value instanceof Object) {
          if(Object.values(value).every(value => !!value)) {
            return resolve(value);
          }
        } else if(value instanceof Array) {
          if(value.every(value => !!value)) {
            return resolve(value);
          }
        } else {
          return resolve(value);
        }
      }
      const date = Date.now();
      const currentTime = date - startTime;
      durationTime += currentTime;
      
      if(durationTime > timeout) {
        return reject(null);
      } 

      setTimeout(() => recursiveCheck(startTime), repeatUnit);
    }
    recursiveCheck(Date.now());
  })
}