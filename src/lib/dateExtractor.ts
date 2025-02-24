export function dateExtractor(frase: string) {
  const regex = /\d{2}\/\d{2}\/\d{4}/;

  const matches = frase.match(regex);
  const data = matches ? matches[0] : null;

  return data;
}
