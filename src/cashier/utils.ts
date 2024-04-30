import noop from 'lodash/noop';

export const loadScript = (url: string) => {
  const finded = document.querySelector<HTMLScriptElement>(
    `script[data-url='${url}']`,
  );

  if (finded) return Promise.resolve(finded);

  const script = document.createElement('script');
  script.dataset.url = url;
  script.src = url;

  const promsie = new Promise<HTMLScriptElement>((resolve, reject) => {
    script.onload = () => {
      resolve(script);
      script.onload = null;
    };
    script.onerror = (error) => {
      reject(new Error(error.toString()));
      script.onerror = null;
    };
    document.body.appendChild(script);
  });

  promsie.catch(noop);

  return promsie;
};
