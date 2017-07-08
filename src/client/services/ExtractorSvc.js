
import ClientAPI from 'ClientAPI'
import BaseSvc from './BaseSvc'

export default class ExtractSvc extends BaseSvc {

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  constructor (config) {

    super (config)

    this.api = new ClientAPI(config.apiUrl)
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  name() {

    return 'ExtractorSvc'
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  extract (modelId, payload = {}) {

    const url = modelId

    return this.api.ajax({
      data: JSON.stringify(payload),
      method: 'POST',
      url: url
    })
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  getStatus (modelId) {

    const url = `/status/${modelId}`

    return this.api.ajax(url)
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  getDownloadUrl (modelId) {

    return `${this.api.apiUrl}/download/${modelId}`
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  download (modelId) {

    const link = document.createElement('a')

    link.href = this.getDownloadUrl(modelId)

    link.click()
  }
}
