export const generateRandomImage = (): string => {
  const width = Math.floor(Math.random() * 400) + 200;
  const height = Math.floor(Math.random() * 400) + 200;
  return `https://picsum.photos/${width}/${height}`;
};
