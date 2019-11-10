<template>
<div id="app">
	<div id="nav">
		<div class="menu">
		</div>
		<svg class="border" width="100vw" height="4px">
			<line x1="0" y1="1" x2="100vw" y2="1" class="line" vector-effect="non-scaling-stroke" />
		</svg>
	</div>
	<router-view/>
</div>
</template>

<style>
* {
	margin: 0;
	padding: 0;
}

#app {
	font-family: 'Consolas', monospace;
	font-size: 12px;

	width: 100vw;
	height: 100vh;
	overflow: hidden;
}

.line {
	stroke: black;
	stroke-width: 6px;
	fill: none;
	stroke-dasharray: 4px 4px;
}

#nav {
	width: 100%;
	height: 5em;
}

#nav svg {
	position: absolute;
	top: calc(5em - 4px);
}

#nav .menu {
	height: 5em;
	width: calc(5em - 4px);
	border-right: 4px solid black;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
