<style>
  .list-wrapper {
    max-height: 50vh;
    overflow: auto;
  }

  #list {
    width: 100%;
  }

  thead {
    font-weight: 800;
  }

  tbody tr:nth-child(odd) {
    background-color: whitesmoke;
  }

  tbody tr:nth-child(even) {
    background-color: #e8e8e8;
  }

  td.actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  td.actions div {
    margin: 2px;
    text-decoration: none;
  }

  .delete-record {
    font-size: 1.2rem;
    cursor: pointer;
  }
</style>

<script>
  import { eventStore } from '../stores'

  const handleRecordDelete = (id) => {
    eventStore.clearCalculation(id)
  }
</script>

<div class='list-wrapper'>
  <table id="list">
    <thead>
      <tr>
        <td>Date</td>
        <td>Name</td>
        <td></td>
      </tr>
    </thead>
    <tbody>
      {#each $eventStore.events as event (event.id)}
        <tr>
          <td>
            {event.startTime
              ? new Date(event.startTime).toLocaleString()
              : 'N/A\xa0\xa0\xa0\xa0\xa0'
            }
          </td>
          <td>
            <a href={event.link}>{event.title}</a>
          </td>
          <td class='actions'>
            <div
              class='delete-record'
              role='button'
              tabIndex={0}
              on:click={() => handleRecordDelete(event.id)}
            >
              ✖︎
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
