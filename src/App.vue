<template>
<div id="app">
	<div id="nav">
		<router-link to="/" class="tab tab--home">
			<div class="tab__icon--home" :class="{'tab__icon--active' : this.$route.path == '/'}">
			</div>
		</router-link>
		<div class="cat">
			lab
		</div>
		<router-link to="/codex" class="tab">
			<div class="tab__icon" :class="{'tab__icon--active' : this.$route.path == '/codex'}">
			</div>
			<!-- <div class="tab__label" :class="{'tab__label--active' : this.$route.path == '/codex'}">
				codex
			</div> -->
		</router-link>
		<router-link to="/lab" class="tab">
			<div class="tab__icon" :class="{'tab__icon--active' : this.$route.path == '/lab'}">
			</div>
			<!-- <div class="tab__label" :class="{'tab__label--active' : this.$route.path == '/lab'}">
				lab
			</div> -->
		</router-link>
		<div class="cat">
			index
		</div>
		<div class="user">
			<div class="user__icon">
			</div>
		</div>
	</div>
	<div id="content">
		<router-view/>
	</div>
</div>
</template>

<style>
* {
	margin: 0;
	padding: 0;
}

:root {
  --sm: 0.15rem;
  --md: 1rem;
  --lg: 4rem;

  --bl: #222;

  font-size: 10px;

  overflow: hidden;
}

#app {
	font-family: 'Major Mono Display', monospace;
	font-weight: bold;

	box-sizing: border-box;

	width: 100vw;
	height: 100vh;
	overflow: hidden;

	display: flex;
	flex-direction: row;
	justify-content: flex-start;
}

#content {
	height: 100%;
	flex-grow: 1;

	background: none;
}

#nav {
	width: var(--lg);
	height: 100%;

	padding-left: var(--md);
	padding-right: var(--md);

	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;

	/* box-shadow: 0px 0px 10px gainsboro; */
}

#nav .branding {
	width: var(--lg);
	height: var(--lg);

	margin-top: var(--md);
	margin-bottom: var(--md);

	background: var(--bl);
}

a {
	text-decoration: none;
}

.cat {
	width: 100%;
	height: calc(0.5 * var(--lg));
	
	margin-top: var(--md);

	box-sizing: border-box;
	/* border-top: 1px solid var(--bl);
	border-bottom: 1px solid var(--bl); */

	text-align: center;
	line-height: calc(0.5 * var(--lg));
	vertical-align: middle;
	color: var(--bl);
}

.tab {
	width: var(--lg);

	margin-top: var(--md);
}

.tab--home {
	height: var(--lg);
}

.tab__icon {
	width: 100%;
	height: var(--lg);

	box-sizing: border-box;
	border: 2px solid grey;
	background: white;
}

.tab__icon--active {
	border: 2px solid var(--bl);
}

.tab__icon--home {
	width: 100%;
	height: 100%;
	box-sizing: border-box;

	border: 2px solid var(--bl);
}

.tab__label {
	width: 100%;
	text-align: center;
	line-height: var(--md);
	vertical-align: middle;
	text-decoration: none;
	color: var(--bl);
	box-sizing: border-box;
}

.tab__label--active {
	font-weight: bolder;
}

#nav .title {
	width: var(--lg);
	width: 100%;

	box-sizing: border-box;
	padding-top: var(--md);
	padding-bottom: var(--md);

	margin-bottom: var(--md);

	border-left: var(--sm) solid var(--bl);
	border-right: var(--sm) solid var(--bl);
	border-bottom: var(--sm) solid var(--bl);
}

#nav .title__main {
	width: 100%;

	transform: translateX(0.1em);

	writing-mode: vertical-rl;
	text-orientation: mixed;
	text-align: right;
	font-size: calc(1.75 * var(--md));
	line-height: var(--lg);
	vertical-align: middle;
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
