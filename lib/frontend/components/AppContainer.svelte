<script>
  import TrackingPanel from './TrackingPanel.svelte'

  import { configStore } from '../stores'

  $: showTrackingPanel = $configStore.track === undefined
</script>

{#if showTrackingPanel}
  <TrackingPanel />
{/if}

