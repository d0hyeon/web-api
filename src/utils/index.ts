export const isExistWithInTimeout = <T = unknown>(value: T, timeout: number = 3000, repeatUnit: number = 300): Promise<T | null> => {
  let durationTime = 0;

  return new Promise((resolve, reject) => {
    const recursiveCheck = (startTime: Date) => {
      if(value) {
        return resolve(value);
      } 
      const date = new Date();
      const currentTime = (startTime.getSeconds() - date.getSeconds()) + (startTime.getMilliseconds() - date.getMilliseconds());
      durationTime += currentTime;

      if(durationTime > timeout) {
        return reject(null);
      } 

      setTimeout(() => recursiveCheck(date), repeatUnit);
    }
    recursiveCheck(new Date());
  })
}