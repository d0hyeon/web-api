export const isExistWithInTimeout = <T = unknown>(value: T, timeout: number = 3000, repeatUnit: number = 300): Promise<T | null> => {
  let durationTime = 0;

  return new Promise((resolve, reject) => {
    const recursiveCheck = (startTime: Date) => {
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
      const date = new Date();
      const currentTime = date.getTime() - startTime.getTime();
      durationTime += currentTime;
      
      if(durationTime > timeout) {
        return reject(null);
      } 

      setTimeout(() => recursiveCheck(date), repeatUnit);
    }
    recursiveCheck(new Date());
  })
}