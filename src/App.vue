<template>
<div id="app">
	<div id="nav">
		<div class="branding">
		</div>
		<div class="title">
			<div class="title__main">
				classhopper
			</div>
		</div>
	</div>
	<div id="content">
	</div>
	<router-view/>
</div>
</template>

<style>
* {
	margin: 0;
	padding: 0;
}

:root {
  --sm: 0.1rem;
  --md: 1rem;
  --lg: 4rem;

  font-size: 10px;
}

#app {
	font-family: 'Major Mono Display', monospace;

	box-sizing: border-box;

	padding-top: var(--md);
	padding-left: var(--md);
	padding-right: var(--md);

	width: 100vw;
	height: 100vh;
	overflow: hidden;

	display: flex;
	flex-direction: row;
	justify-content: flex-start;
}

.line {
	stroke: #222;
	stroke-width: 6px;
	fill: none;
	stroke-dasharray: 4px 4px;
}

#content {
	height: 100%;
	flex-grow: 1;

	background: gainsboro;
}

#nav {
	width: var(--lg);
	height: 100%;

	margin-right: var(--md);

	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
}

#nav .branding {
	width: var(--lg);
	height: var(--lg);

	margin-bottom: var(--md);

	background: black;
}

#nav .title {
	width: var(--lg);
	width: 100%;

	box-sizing: border-box;
	padding-top: var(--md);
	padding-bottom: var(--md);

	margin-bottom: var(--md);

	border-left: var(--sm) solid rgb(54, 54, 54);
	border-right: var(--sm) solid rgb(54, 54, 54);
	border-bottom: var(--sm) solid rgb(54, 54, 54);
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
	height: var(--lg);
	width: var(--lg);

	margin-right: var(--md);

	box-sizing: border-box;

	border: var(--sm) solid rgb(54, 54, 54);
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
