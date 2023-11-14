export function generateUniqueUppercaseString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  while (result.length < length) {
    const randomChar = characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
    if (result.indexOf(randomChar) === -1) {
      result += randomChar;
    }
  }

  return result;
}
