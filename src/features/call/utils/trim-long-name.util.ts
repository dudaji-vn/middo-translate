const MAXIMIZE_NAME_DEFAULT_LENGTH = 15;
export default function trimLongName(name: string, maxLength?: number) {

  if(!name) return '';
  if (name.length > ((maxLength || MAXIMIZE_NAME_DEFAULT_LENGTH) + 2)) {
    return `${name.slice(0, (maxLength || MAXIMIZE_NAME_DEFAULT_LENGTH))}...`;
  }
  return name;
}