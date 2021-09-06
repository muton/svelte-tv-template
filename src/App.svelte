<script lang="ts">
  import _ from "lodash-es";  

  export let name: string;
</script>

<div id="main">
  <h1>Hello {name}!</h1>
  <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</div>

<style>
  #main {
    padding: 80px;
    width: 1280px;
    height: 720px;
    background-color: #eeeeff;
    overflow: auto;	
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

</style>