const kebabOrSnakeToUpperCase = (str: string | undefined): string | undefined =>
  str
    ?.split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    ?.split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export default kebabOrSnakeToUpperCase;
