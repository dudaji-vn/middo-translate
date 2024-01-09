export default function formatTextUppercase(text: string): string {
    return text.replace(/-|_/g, ' ').toLowerCase().replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
}