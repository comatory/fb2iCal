<style>
  #tracking-panel {
    position: fixed;
    bottom: 0;
    border: 3px solid navy;
    background-color: lightyellow;
    max-width: 600px;
    margin: 5px;
    padding: 5px;
  }

  #tracking-panel__yes-button,
  #tracking-panel__no-button {
    font-size: 1.2rem;
  }

  #tracking-panel__yes-button {
    font-weight: 600;
    margin-right: 5px;
  }
</style>

<script>
  import { configStore } from '../stores'

  const handleYesButtonClick = () => {
    configStore.setValue('track', true)
  }

  const handleNoButtonClick = () => {
    configStore.setValue('track', false)
  }
</script>

<div id="tracking-panel">
  <p>
    Can we store anonymous logs? This data is only saved to our internal database and is used to debug the parsing of the web pages. We'll ask you only this time and won't bother you again.
  </p>

  <button on:click={handleYesButtonClick} id='tracking-panel__yes-button'>
    Ok
  </button>
  <button on:click={handleNoButtonClick} id='tracking-panel__no-button'>
    Nope
  </button>
</div>
