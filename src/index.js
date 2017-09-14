'use strict'

if (module.hot) {
  module.hot.accept()
}

import riot from 'riot'
import './styles/index.scss'
import './components/candidate-cloud.tag'

riot.mount('candidate-cloud', {intialValue: 42})
