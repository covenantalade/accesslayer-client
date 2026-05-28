import { env } from '@/utils/env.utils';

export interface UtmParams {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
}

export const getConfiguredUtmParams = (): UtmParams => {
    const params: UtmParams = {};

    if (env.VITE_UTM_SOURCE) params.utm_source = env.VITE_UTM_SOURCE;
    if (env.VITE_UTM_MEDIUM) params.utm_medium = env.VITE_UTM_MEDIUM;
    if (env.VITE_UTM_CAMPAIGN) params.utm_campaign = env.VITE_UTM_CAMPAIGN;
    if (env.VITE_UTM_TERM) params.utm_term = env.VITE_UTM_TERM;
    if (env.VITE_UTM_CONTENT) params.utm_content = env.VITE_UTM_CONTENT;

    return params;
};

export const appendUtmParams = (inputUrl: string, overrideParams?: UtmParams): string => {
    const configured = overrideParams ?? getConfiguredUtmParams();

    // If no UTM params configured, return original URL unchanged
    const keys = Object.keys(configured) as Array<keyof UtmParams>;
    const hasAny = keys.some((k) => !!configured[k]);
    if (!hasAny) return inputUrl;

    try {
        const url = new URL(inputUrl);

        const search = url.searchParams;

        if (configured.utm_source) search.set('utm_source', configured.utm_source);
        if (configured.utm_medium) search.set('utm_medium', configured.utm_medium);
        if (configured.utm_campaign) search.set('utm_campaign', configured.utm_campaign);
        if (configured.utm_term) search.set('utm_term', configured.utm_term);
        if (configured.utm_content) search.set('utm_content', configured.utm_content);

        // Preserve hash and other parts — URL.toString() keeps them
        return url.toString();
    } catch {
        // If URL parsing fails, fall back to original input
        return inputUrl;
    }
};

export default appendUtmParams;
