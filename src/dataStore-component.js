import { DataStore } from './dataStore'
import { Component } from 'preact'

/**
 * Extend Preact's Component class to react to a dataStore's watch method.
 */
export class DataStoreComponent extends Component {
  /**
   * @typedef {Object.<string, any>} Props
   * @property {DataStore} Props.dataStore
   * @property {any} Props.render
   * @param {Props} props 
   */
  constructor(props) {
    super(props)
    /**
     * @property {DataStore} dataStore
     */
    this.dataStore = /** @type {DataStore}*/(props.dataStore)
    if (props.dataStore instanceof DataStore) {
      this.state = props.dataStore.state
      props.dataStore.watch('dataStoreStateChanged', () => {
        this.forceUpdate()
      })
    }
    if (props.render) this.render = props.render
  }
}
