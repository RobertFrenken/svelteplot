<!-- @component
    Renders the convex hull of data points. Supports grouping by z/fill/stroke
    to draw separate hulls per group.
-->
<script lang="ts" generics="Datum = DataRecord">
    interface HullMarkProps extends BaseMarkProps<Datum> {
        /** the input data array */
        data?: Datum[];
        /** the horizontal position channel */
        x?: ChannelAccessor<Datum>;
        /** the vertical position channel */
        y?: ChannelAccessor<Datum>;
        /** the grouping channel; separate hulls per group */
        z?: ChannelAccessor<Datum>;
    }

    import { Delaunay } from 'd3-delaunay';
    import type {
        DataRecord,
        BaseMarkProps,
        ChannelAccessor,
        MarkType,
        ScaledDataRecord
    } from '../types/index.js';
    import { resolveProp, resolveStyles } from '../helpers/resolve.js';
    import { recordizeXY } from '../transforms/recordize.js';
    import Mark from '../Mark.svelte';
    import { usePlot } from 'svelteplot/hooks/usePlot.svelte.js';
    import { getPlotDefaults } from '../hooks/plotDefaults.js';
    import { SvelteMap } from 'svelte/reactivity';

    const DEFAULTS = {
        ...getPlotDefaults().hull
    };

    let markProps: HullMarkProps = $props();

    const {
        data = [] as Datum[],
        class: className = 'hull',
        ...options
    }: HullMarkProps = $derived({ ...DEFAULTS, ...markProps });

    const args = $derived(
        recordizeXY({
            data: data as any[],
            ...options
        })
    );

    const plot = usePlot();
    const groupByKey = $derived(
        (args.z || args.fill || args.stroke || null) as ChannelAccessor | null
    );

    function computeHulls(scaledData: ScaledDataRecord[]) {
        // Group by z channel (or fill/stroke as fallback)
        const groups = new SvelteMap<
            string | number | null,
            { indices: number[]; datum: ScaledDataRecord }
        >();

        for (let i = 0; i < scaledData.length; i++) {
            const d = scaledData[i];
            if (!d.valid || !Number.isFinite(d.x) || !Number.isFinite(d.y)) continue;
            const key = (groupByKey ? resolveProp(groupByKey, d.datum) : null) as
                | string
                | number
                | null;
            let group = groups.get(key);
            if (!group) {
                group = { indices: [], datum: d };
                groups.set(key, group);
            }
            group.indices.push(i);
        }

        const hulls: { path: string; datum: ScaledDataRecord }[] = [];

        for (const [, group] of groups) {
            if (group.indices.length < 2) continue;
            const points = group.indices.map((i) => scaledData[i]);
            const delaunay = Delaunay.from(
                points,
                (d) => d.x as number,
                (d) => d.y as number
            );
            const path = delaunay.renderHull();
            if (path) hulls.push({ path, datum: group.datum });
        }

        return hulls;
    }
</script>

<Mark
    type={'hull' as MarkType}
    channels={['x', 'y', 'fill', 'opacity', 'stroke', 'fillOpacity', 'strokeOpacity']}
    defaults={{ fill: 'none', stroke: 'currentColor' }}
    {...args}>
    {#snippet children({ scaledData, usedScales })}
        {@const hulls = computeHulls(scaledData)}
        <g class={className}>
            {#each hulls as hull, i (i)}
                {@const [style, styleClass] = resolveStyles(
                    plot,
                    hull.datum,
                    { strokeWidth: 1.5, ...args },
                    'stroke',
                    usedScales
                )}
                <path d={hull.path} class={styleClass} {style} />
            {/each}
        </g>
    {/snippet}
</Mark>
