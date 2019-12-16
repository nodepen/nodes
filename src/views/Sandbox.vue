<template>
    <div id="sandbox">
        <div class="toolbar">
            <div 
            v-for="(category, index) in categories" 
            :key='category' 
            :class="{'toolbar__category--active' : selected === category}" 
            :style="{'animation-delay': `${index * 0.1}s`}"
            class="toolbar__category"
            @click="selected = category">
                {{category}}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data() {
        return {
            selected: '',
            categories: [] as string[],
        }
    },
    created() {
        this.categories = this.$store.state.allCategories.map((x:string) => x.toLowerCase());
    }
})
</script>

<style scoped>
#sandbox {
    width: 100%;
    height: 100%;

    box-sizing: border-box;
    padding: var(--md);

    overflow: hidden;

    display: flex;
    flex-direction: column;
}

@keyframes drop {
    from {
        transform: translateY(-20px);
    }
    to {
        transform: translateY(0);
    }
}

.toolbar {
    width: 100%;

    display: flex;
    flex-direction: row;

    overflow-x: auto;
    font-size: var(--md);
}

.toolbar__category {
    margin-right: var(--md);
    padding-bottom: var(--sm);
    border-bottom: 0.7mm solid rgba(0, 0, 0, 0);
    transform: translateY(-20px);

    animation-name: drop;
    animation-duration: 0.35s;
    animation-fill-mode: forwards;
}

.toolbar__category:hover {
    cursor: pointer;
    border-bottom: 0.7mm solid black;
}

.toolbar__category--active {
    border-bottom: 0.7mm solid black;
}
</style>