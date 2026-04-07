<!-- @component
    Renders individual Delaunay triangulation edges as separate paths,
    allowing per-edge styling based on the source data point.
-->
<script lang="ts" generics="Datum = DataRecord">
    interface DelaunayLinkMarkProps extends BaseMarkProps<Datum>, LinkableMarkProps<Datum> {
        /** the input data array */
        data?: Datum[];
        /** the horizontal position channel */
        x?: ChannelAccessor<Datum>;
        /** the vertical position channel */
        y?: ChannelAccessor<Datum>;
        /** the grouping channel; separate triangulations per group */
        z?: ChannelAccessor<Datum>;
    }

    import { Delaunay } from 'd3-delaunay';
    import type {
        DataRecord,
        BaseMarkProps,
        ChannelAccessor,
        LinkableMarkProps,
        MarkType,
        ScaledDataRecord
    } from '../types/index.js';
    import { resolveStyles } from '../helpers/resolve.js';
    import { groupFacetsAndZ } from '../helpers/group.js';
    import { recordizeXY } from '../transforms/recordize.js';
    import { sort } from '../index.js';
    import Mark from '../Mark.svelte';
    import Anchor from './helpers/Anchor.svelte';
    import { addEventHandlers } from './helpers/events.js';
    import { usePlot } from 'svelteplot/hooks/usePlot.svelte.js';
    import { getPlotDefaults } from '../hooks/plotDefaults.js';
    import { SvelteSet } from 'svelte/reactivity';

    const DEFAULTS = {
        ...getPlotDefaults().delaunayLink
    };

    let markProps: DelaunayLinkMarkProps = $props();

    const {
        data = [] as Datum[],
        class: className = 'delaunay-link',
        ...options
    }: DelaunayLinkMarkProps = $derived({ ...DEFAULTS, ...markProps });

    const args = $derived(
        sort(
            recordizeXY({
                data: data as any[],
                ...options
            })
        )
    );

    const plot = usePlot();

    interface Edge {
        source: ScaledDataRecord;
        path: string;
    }

    function computeEdges(scaledData: ScaledDataRecord[]) {
        const scaledByDatum = new Map(scaledData.map((d) => [d.datum, d]));
        const allEdges: Edge[] = [];

        groupFacetsAndZ(
            scaledData.map((d) => d.datum),
            args,
            (groupItems) => {
                const groupScaled = groupItems
                    .map((d) => scaledByDatum.get(d))
                    .filter(
                        (d): d is ScaledDataRecord =>
                            d !== undefined &&
                            d.valid &&
                            Number.isFinite(d.x as number) &&
                            Number.isFinite(d.y as number)
                    );

                if (groupScaled.length < 2) return;

                const delaunay = Delaunay.from(
                    groupScaled,
                    (d) => d.x as number,
                    (d) => d.y as number
                );

                const { halfedges, triangles } = delaunay;
                const seen = new SvelteSet<string>();

                for (let i = 0; i < halfedges.length; i++) {
                    const j = halfedges[i];
                    if (j < i && j !== -1) continue;
                    const a = triangles[i];
                    const b = triangles[i % 3 === 2 ? i - 2 : i + 1];
                    const key = a < b ? `${a},${b}` : `${b},${a}`;
                    if (seen.has(key)) continue;
                    seen.add(key);

                    const p = groupScaled[a];
                    const q = groupScaled[b];
                    allEdges.push({
                        source: p,
                        path: `M${p.x},${p.y}L${q.x},${q.y}`
                    });
                }
            },
            false
        );

        return allEdges;
    }
</script>

<Mark
    type={'delaunayLink' as MarkType}
    channels={['x', 'y', 'fill', 'opacity', 'stroke', 'fillOpacity', 'strokeOpacity']}
    defaults={{ fill: 'none', stroke: 'currentColor' }}
    {...args}>
    {#snippet children({ mark, usedScales, scaledData })}
        {@const edges = computeEdges(scaledData)}
        {#if edges.length > 0}
            <g class={className}>
                {#each edges as edge, i (i)}
                    {@const d = edge.source}
                    {@const [style, styleClass] = resolveStyles(
                        plot,
                        d,
                        { strokeWidth: 1, ...args },
                        'stroke',
                        usedScales
                    )}
                    <Anchor options={options as any} datum={d.datum}>
                        <path
                            d={edge.path}
                            class={styleClass}
                            {style}
                            {@attach addEventHandlers({
                                plot,
                                options: args as any,
                                datum: d?.datum
                            })} />
                    </Anchor>
                {/each}
            </g>
        {/if}
    {/snippet}
</Mark>
