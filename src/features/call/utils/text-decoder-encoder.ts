export function encoderData(data: any) {
  const encoder = new TextEncoder();
  const dataString = JSON.stringify(data);
  const dataArray = encoder.encode(dataString);
  return dataArray;
}

export function decoderData(data: any) {
  const decoder = new TextDecoder();
  const dataString = decoder.decode(data);
  const dataObject = JSON.parse(dataString);
  return dataObject;
}