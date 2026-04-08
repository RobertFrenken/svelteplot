import { loadCSV, loadJSON } from '$lib/helpers/data.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ fetch }) => {
    const [penguins, walmart, statesTopo] = await Promise.all([
        loadCSV(fetch, 'penguins'),
        loadCSV(fetch, 'walmart'),
        loadJSON(fetch, 'us-states')
    ]);
    return { data: { penguins, walmart, statesTopo } };
};
