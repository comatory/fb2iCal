<style>
  #form {
    flex: 1;
    display: flex;
    min-width: 300px;
  }

  #form input {
    margin: 5px;
  }

  input#url {
    flex: 1;
    font-size: 1rem;
  }
</style>

<script>
  import { createEvent } from '../actions'
  import logger from '../services/logger'

  let value

  const onChange = (e) => {
    value = e.currentTarget.value
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    createEvent(value, { logger })
  }
</script>

<form id="form">
  <input
    required
    pattern="^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?|\d+$"
    id="url"
    name="url"
    bind:value={value}
    placeholder="Paste / type FB event URL or event number..."
    title="Please insert Facebook Event URL / Number"
  />
  <input
    id="submit"
    type='submit'
    value='Submit'
    on:click={handleSubmit}
  />
</form>
