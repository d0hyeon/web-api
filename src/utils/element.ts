type CssSelector = string;

export const onLoadChildren = (element: Element, selector: CssSelector): Promise<Element[]> => {
  const onLoadHandler = () => Promise.resolve();
  return new Promise((resolve) => {
    let promisesForMediaLoading = [];
    const nodes = element.querySelectorAll(selector);
    
    for(let i = 0, length = nodes.length; i < length; i ++) {
      promisesForMediaLoading[i] = nodes[i].addEventListener('load', onLoadHandler);
    }
    
    Promise.all(promisesForMediaLoading)
      .then(() => {
        resolve(Array.from(nodes));
        for(let i = 0, length = nodes.length; i < length; i ++) {
          nodes[i].removeEventListener('load', onLoadHandler);
        }
      })
  })
}
