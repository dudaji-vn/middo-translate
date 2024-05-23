import download from "downloadjs";
interface IDownloadFile {
    url: string;
    fileName?: string;
    mimeType: string;
    successCallback?: () => void;
}
export default function downloadFile({ url, fileName, mimeType, successCallback }: IDownloadFile) {
    if(!url) return;
    fetch(url)
    .then(response => response.blob())
    .then(blob => {
        download(blob, fileName || 'download', mimeType)
        if(successCallback) successCallback();
    });
}