export interface TextData {
  type: string;
  payload: unknown;
}

export function encoderData(data: TextData) : Uint8Array {
  const encoder = new TextEncoder();
  const dataString = JSON.stringify(data);
  const dataArray = encoder.encode(dataString);
  return dataArray;
}

export function decoderData(data: Uint8Array) : TextData {
  const decoder = new TextDecoder();
  const dataString = decoder.decode(data);
  const dataObject = JSON.parse(dataString);
  return dataObject;
}