<script>
  import TrackingPanel from './TrackingPanel.svelte'
  import EventList from './EventList.svelte'

  import { configStore, eventStore } from '../stores'

  $: showTrackingPanel = $configStore.track === undefined
  $: showEventList = $eventStore.length > 0
</script>

{#if showTrackingPanel}
  <TrackingPanel />
{/if}

{#if showEventList}
  <EventList />
{/if}

