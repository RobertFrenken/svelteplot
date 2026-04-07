<script module lang="ts">
    export const title = 'Voronoi mesh (Walmart stores)';
    export const description =
        'A Voronoi mesh over Walmart store locations projected onto a USA basemap. Data by <a href="https://users.econ.umn.edu/~holmes/data/WalMart/index.html">Thomas J. Holmes</a>.';
    export const data = {
        walmart: '/data/walmart.csv',
        statesTopo: '/data/us-states.json'
    };
</script>

<script lang="ts">
    import { Plot, Geo, Dot, VoronoiMesh } from 'svelteplot';
    import * as topojson from 'topojson-client';
    import type { USStatesAtlas, WalmartRow } from '../types';

    let { walmart, statesTopo }: { walmart: WalmartRow[]; statesTopo: USStatesAtlas } = $props();

    const land = $derived(topojson.feature(statesTopo, statesTopo.objects.land));
</script>

<Plot projection="albers-usa" height={420}>
    <Geo data={[land]} stroke="currentColor" strokeWidth={1} />
    <VoronoiMesh data={walmart} x="lon" y="lat" strokeOpacity={0.2} />
    <Dot data={walmart} x="lon" y="lat" r={1} fill />
</Plot>
