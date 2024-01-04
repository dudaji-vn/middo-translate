const MAXIMIZE_NAME_LENGTH = 15;
export default function trimLongName(name: string) {
  if (name.length > MAXIMIZE_NAME_LENGTH) {
    return `${name.slice(0, MAXIMIZE_NAME_LENGTH)}...`;
  }
  return name;
}