'use strict'

if (module.hot) {
  module.hot.accept()
}

import riot from 'riot'
import * as d3 from 'd3'

import './styles/index.scss'
import './components/candidate-cloud.tag'
import './components/topic-cloud.tag'

d3.csv('/data/candidates-topics-custom-cloud.csv', (data) => {
  riot.mount('topic-cloud', { data })
})

riot.mount('candidate-cloud', {intialValue: 42})
