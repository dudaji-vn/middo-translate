import download from "downloadjs";
import JSZip from "jszip";

export interface IDownloadFile {
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

export const downloadFiles = (files: IDownloadFile[]) => {
    // Case: Single file
    if(files.length === 1) {
        downloadFile(files[0]);
        return;
    }
    // Case: Multiple files
    const zip = new JSZip();
    const promises: Promise<any>[] = [];
    files.forEach((file: IDownloadFile) => {
        promises.push(
            fetch(file.url)
            .then(response => response.blob())
            .then(blob => {
                zip.file(file.fileName || 'download', blob);
            })
        );
    });
    const date = new Date();
    const today = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const fileName = `Middo-${today}.zip`;
    Promise.all(promises).then(() => {
        zip.generateAsync({ type: "blob" })
        .then((content) => {
            download(content, fileName, 'application/zip');
        });
    });

};