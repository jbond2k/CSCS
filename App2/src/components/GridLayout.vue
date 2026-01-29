<template>
    <div>
        <div class="grid">
            <div class="a"><slot name="a" /></div>
            <div class="b"><slot name="b" /></div>
            <div class="c"><slot name="c" /></div>
            <div class="d"><slot name="d" /></div>
            <div class="e"><slot name="e" /></div>
            <div class="f"><slot name="f" /></div>
            <div class="g"><slot name="g" /></div>
        </div>
    </div>
</template>

<style scoped>
.grid {
    display: grid;
    width: 100vw;
    height: 90vh;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(7, 1fr);
    grid-template-areas:
    "a a a b b c c"
    "a a a b b c c"
    "d d d b b c c"
    "d d d b b f f"
    "d d d e e f f"
    "g g g g g g g"
    "g g g g g g g"
}

.a { grid-area: a; } /* 3×2 */
.b { grid-area: b; } /* 2×4 */
.c { grid-area: c; } /* 2×3 */
.d { grid-area: d; } /* 3×3 */
.e { grid-area: e; } /* 2×1 */
.f { grid-area: f; } /* 2×2 */
.g { grid-area: g; } /* 7×2 */

div {
    overflow: hidden;
    width: 100%;
    height: 100%;
}
</style>