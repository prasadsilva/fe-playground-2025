// https://developers.google.com/youtube/player_parameters
// https://stackoverflow.com/a/79225917/2847817
export const youtubeUrlToEmbed = (urlString: string | undefined | null): string | null | undefined => {
    const template = (v: string) => `https://www.youtube.com/embed/${v}`;
    if (urlString && URL.canParse(urlString)) {
        const url = new URL(urlString);
        // short URL
        if (url.hostname === 'www.youtu.be' || url.hostname === 'youtu.be') {
            return template(url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname);
        }
        // regular URL
        const v = url.searchParams.get('v');
        if ((url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') && v) {
            return template(v);
        }
    }
    return urlString;
};