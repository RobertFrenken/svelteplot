---
title: Delaunay / Voronoi marks
---

The Delaunay marks compute a [Delaunay triangulation](https://en.wikipedia.org/wiki/Delaunay_triangulation) or its dual [Voronoi diagram](https://en.wikipedia.org/wiki/Voronoi_diagram) from **x** and **y** positions. Five marks are available:

| Mark             | Description                                  |
| ---------------- | -------------------------------------------- |
| **DelaunayLink** | Individual triangle edges (per-edge styling) |
| **DelaunayMesh** | Full triangulation as a single path          |
| **Hull**         | Convex hull (supports grouping)              |
| **Voronoi**      | Individual Voronoi cells (per-cell styling)  |
| **VoronoiMesh**  | Full Voronoi diagram as a single path        |

## Voronoi

The **Voronoi** mark partitions the plane into cells, one per data point, each containing the area closest to that point. Per-cell styling is supported via the standard fill and stroke channels.

```svelte live
<script>
    import { Plot, Voronoi, Dot } from 'svelteplot';
    import { page } from '$app/state';

    const { penguins } = $derived(page.data.data);
</script>

<Plot grid testid="voronoi-penguins">
    <Voronoi
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        fill="species"
        fillOpacity={0.3}
        stroke="species" />
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        fill="species"
        r={2} />
</Plot>
```

## VoronoiMesh

The **VoronoiMesh** mark renders the full Voronoi diagram as a single `<path>`, useful for a lighter visual or background grid.

```svelte live
<script>
    import { Plot, VoronoiMesh, Dot } from 'svelteplot';
    import { page } from '$app/state';

    const { penguins } = $derived(page.data.data);
</script>

<Plot grid testid="voronoi-mesh">
    <VoronoiMesh
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        strokeOpacity={0.3} />
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        fill="species"
        r={3} />
</Plot>
```

## DelaunayMesh

The **DelaunayMesh** mark renders the full Delaunay triangulation as a single `<path>`.

```svelte live
<script>
    import { Plot, DelaunayMesh, Dot } from 'svelteplot';
    import { page } from '$app/state';

    const { penguins } = $derived(page.data.data);
</script>

<Plot grid testid="delaunay-mesh">
    <DelaunayMesh
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        strokeOpacity={0.3} />
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        fill="species"
        r={3} />
</Plot>
```

## DelaunayLink

The **DelaunayLink** mark renders individual Delaunay edges as separate paths, allowing per-edge styling from the source data point.

```svelte live
<script>
    import { Plot, DelaunayLink, Dot } from 'svelteplot';
    import { page } from '$app/state';

    const { penguins } = $derived(page.data.data);
</script>

<Plot grid testid="delaunay-link">
    <DelaunayLink
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        strokeOpacity={0.5} />
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        fill="species"
        r={3} />
</Plot>
```

## Hull

The **Hull** mark renders the convex hull of data points. Use the **z**, **fill**, or **stroke** channel to draw separate hulls per group.

```svelte live
<script>
    import { Plot, Hull, Dot } from 'svelteplot';
    import { page } from '$app/state';

    const { penguins } = $derived(page.data.data);
</script>

<Plot grid testid="hull-species">
    <Hull
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        fill="species"
        fillOpacity={0.1}
        strokeWidth={2} />
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        fill="species"
        r={3} />
</Plot>
```
