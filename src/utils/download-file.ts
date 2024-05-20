import download from "downloadjs";
interface IDownloadFile {
    url: string;
    fileName?: string;
    mimeType: string;
}
export default function downloadFile({ url, fileName, mimeType }: IDownloadFile) {
    if(!url) return;
    fetch(url)
    .then(response => response.blob())
    .then(blob => {
        download(blob, fileName || 'download', mimeType)
    });
}