'use strict'

if (module.hot) {
  module.hot.accept()
}

import riot from 'riot'
import { csv } from 'd3'

import './styles/index.scss'
import './components/candidate-cloud.tag'
import './components/topic-cloud.tag'

csv('/data/candidates-topics-custom-cloud.csv', (data) => {
  riot.mount('topic-cloud', { data })
})

riot.mount('candidate-cloud')
