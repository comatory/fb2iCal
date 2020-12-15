<script>
  import TrackingPanel from './TrackingPanel.svelte'

  import { configStore } from '../stores'

  $: showTrackingPanel = $configStore.track === undefined

  configStore.subscribe(console.log)
</script>

{#if showTrackingPanel}
  <TrackingPanel />
{/if}

