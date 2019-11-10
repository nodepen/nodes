<template>
<div id="app">
	<div id="nav">
		<div class="branding">
			<div class="branding__icon">
			</div>
		</div>
		<div class="user">
		</div>
		<div class="title">
			<div class="title__main">
				classhopper
			</div>
		</div>

		<!-- <svg class="border__top" width="100vw" height="4px">
			<line x1="0" y1="1" x2="100vw" y2="1" class="line" vector-effect="non-scaling-stroke" />
		</svg>
		<svg class="border__bottom" width="100vw" height="4px">
			<line x1="0" y1="1" x2="100vw" y2="1" class="line" vector-effect="non-scaling-stroke" />
		</svg> -->
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
  --sm: 0.25mm;
  --md: 1rem;
  --lg: 3rem;

  font-size: 12px;
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
}

.line {
	stroke: #222;
	stroke-width: 6px;
	fill: none;
	stroke-dasharray: 4px 4px;
}

#nav {
	width: 100%;
	height: var(--lg);

	margin-bottom: var(--md);

	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
}

.border__top {
	position: absolute;
	transform: translateX(4px);
	top: calc(5em - 8px);
}

.border__bottom {
	position: absolute;
	top: calc(5em - 4px);
}

#nav .branding {
	height: var(--lg);

	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
}

#nav .branding__icon {
	width: var(--lg);
	height: var(--lg);

	margin-right: var(--md);

	background: black;
}

#nav .title {
	height: var(--lg);
	flex-grow: 1;

	padding-right: var(--md);

	box-sizing: border-box;

	border-top: var(--sm) solid rgb(54, 54, 54);
	border-right: var(--sm) solid rgb(54, 54, 54);
	border-bottom: var(--sm) solid rgb(54, 54, 54);
}

#nav .title__main {
	height: 100%;
	width: 100%;

	transform: translateY(-0.08em);

	text-align: right;
	font-size: 2rem;
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
