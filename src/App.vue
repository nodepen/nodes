<template>
  <div id="app">
    <graph-editor />
    <div id="content">
      <router-view />
    </div>
    <nav>
      <div class="tabs">
        <router-link
          to="/"
          class="tab"
        >
          sandbox
        </router-link>
        <router-link
          to="/g"
          class="tab"
        >
          glossary
        </router-link>
        <router-link
          to="/t"
          class="tab"
        >
          tutorials
        </router-link>
      </div>
      <div class="toggles">
        <div class="toggle" />
        <div class="toggle" />
        <div class="toggle" />
      </div>
    </nav>
    <footer>
      <div class="footer__title">
        glasshopper.io
      </div>
      <div class="footer__version">
        0.3.6
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GraphEditor from './components/GraphEditor.vue';

export default Vue.extend({
	components: {
		GraphEditor
	},
})
</script>

<style>
* {
	margin: 0;
	padding: 0;
}

*::-webkit-scrollbar {
  display: none;
}

:root {
  --sm: 0.5rem;
  --md: 1rem;
  --lg: 2rem;

  --bl: #222;

  font-size: 10px;

  overflow: hidden;
}

a {
	text-decoration: none;
	color: black;
}

body {
	pointer-events: none;
}

#app {
	font-family: 'Major Mono Display', monospace;
	font-weight: bold;

	box-sizing: border-box;

	pointer-events: none;

	width: 100vw;
	height: 100vh;
	overflow: hidden;

	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}

#app * {
	pointer-events: all;
}

#content {
	width: 100%;
	flex-grow: 1;
	background: none;
	pointer-events: none;
}

nav {
	width: 100%;
	max-width: 100%;
	padding-left: var(--md);
	padding-right: var(--md);
	box-sizing: border-box;
	background: none;

	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: nowrap;
	
	overflow-x: hidden;
}

.toggles {
	display: flex;
	flex-direction: row;
}

.toggle {
	width: calc(var(--lg) + var(--sm) + 1.4mm);
	height: calc(var(--lg) + var(--sm) + 1.4mm);
	margin-left: var(--md);

	box-sizing: border-box;

	border: 0.7mm solid black;
}

.tabs {
	flex-grow: 1;
	display: flex;
	flex-direction: row;
	overflow-x: auto;

	user-select: none;
}

.tab {
	margin-right: calc(2 * var(--md));
	font-size: var(--lg);
	box-sizing: border-box;
	padding-bottom: var(--sm);
	border-bottom: 0.7mm solid rgba(0, 0, 0, 0);
}

.router-link-exact-active {
	border-bottom: 0.7mm solid black;
}

footer {
	width: 100%;
	padding: var(--md);

	box-sizing: border-box;

	background: none;

	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.footer__title {
	font-size: var(--md);
}

#nav .user {
	width: var(--lg);
	flex-grow: 1;

	box-sizing: border-box;

	display: flex;
	flex-direction: column;
	justify-content: flex-end;

	margin-bottom: var(--md);
}

#nav .user__icon {
	width: var(--lg);
	height: var(--lg);

	box-sizing: border-box;

	border: var(--sm) solid var(--bl);
	border-radius: var(--lg);
}
</style>
