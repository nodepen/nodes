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

	padding-left: var(--md);

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

	margin-right: var(--md);

	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
}

#nav .branding {
	width: var(--lg);
	height: var(--lg);

	margin-top: var(--md);
	margin-bottom: var(--md);

	background: var(--bl);
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
