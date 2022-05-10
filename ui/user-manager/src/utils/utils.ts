
export class Utils {
    static getRootUrl(url: string) {
        let splitArray = url.split("/");

        return splitArray[0]+"//"+splitArray[2];
    }
}