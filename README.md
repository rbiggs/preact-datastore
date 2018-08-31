# preact-datastore

## Provides state management for stateless class components.


Managing state for class components can get complicated and hard to follow. Redux, Mobx and friends decouple state from components, but these can be overkill for many smaller projects.

Preact DataStore provides another, simpler solution: a separate dataStore and a custom component that watches the dataStore to see when its state changes. Multile components can share the same dataStore.

## Installation
```javascript
npm i -D preact-datastore
```

After installing you can import it into your Preact project:

```javascrpt
import { h, render, Component } from 'preact'
import { DataStore, DataStoreComponent } from 'preact-datastore'
```

## Start with a dataStore

First thing you need to do is create a dataStore. You do this by creating a new instance of the DataStore class. This takes one argument, the data you are going to use. For the dataStore to work, it need the data to have a particular format as an object literal whose main property is `state`. Any other properties that container data will be children of `state`.

Considering that we have an array of fruits, we would need to create the dataStore as follows:

```javascript
const fruits = ['Apples', 'Oranges', 'Bananas']
const fruitDataStore = new DataStore({
  state: {
    fruits: fruits
  }
})
```

We can now access the fruits from the dataStore as follows:

```javascript
const data = fruitDataStore.state.fruits
```

## setState

DataStores have one public function: `setState`. You use this to change the dataStore's state. This takes a callback that receives the previous state as its argument. To update the dataStore's state, you operate on the previous state and then return it. If you forget to return the previous state, the dataStore will not update.

When you upate a dataStore with `setState` it dispatches and event, `dataStoreStateChanged`, along with the new state. Any component watching the dataStore will re-render with the new data when this happens.

In the following example we add a new item to `fruitDataStore`:

```javascript
fruitDataStore.setState(prevState => {
  // Update the fruits property on the dataStore's state:
  prevState.fruits.push('Grapes')
  // Don't forget to return prevState:
  return prevState
})
```

In the next example we remove an item:

```javascript
fruitDataStore.setState(prevState => {
  // Remove "Oranges" from fruits:
  prevState.fruits = prevState.fruits.filter(fruit => fruit !== 'Oranges')
  // Don't forget to return prevState:
  return prevState
})
```

## DataStoreComponent

Finally, we need to create a component that watches our dataStore. We do that my extending DataStoreComponent, just like we do with Preact's Component class.

Before we create our component, we need to make a small adjustment to our dataStore. We need a default value for our input so that when the list re-renders, the input gets reset. In this case we want the input to be empty. We'll use a new property for that, `inputValue`:

```javascript
const fruits = ['Apples', 'Oranges', 'Bananas']
const fruitDataStore = new DataStore({
  state: {
    fruits: fruits,
    // This will reset the input value to empty:
    inputValue: ''
  }
})
```

Passing the datastore as a prop to a DataStoreComponent instance makes it available inside our component on the `props` argument in the render function, and in methods from `this.props`.

In the example below we define a component list. Preact passes `this.props` to the render function as the `props` argument. Notice how we use this in our render function to get the state of the dataStore in order to render the fruit items (`const state = props.dataStore.state`):

```javascript
class List extends DataStoreComponent {
  render(props) {
    // Get the state from the dataStore:
    const state = props.dataStore.state
    return (
      <div class='list-container'>
        <p class='form'>
          <input ref={(input) => { this.input = input }} type="text" value={state.inputValue}/>
          <button class='add-item' onClick={() => this.addItem(props.dataStore)}>Add</button>
        </p>
        <ul class='list'>
          {
            state.fruits.map(item => (
              <li class='list-item'>
                <span class='label'>{item}</span>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
  componentDidMount() {
    this.input.focus()
  }
  addItem(dataStore) {
    const value = this.input.value
    if (value) {
      // Update the dataStore:
      dataStore.setState(prevState => {
        prevState.fruits.push(value)
        return prevState
      })
      this.input.focus()
    } else {
      alert('Please provide a value before submitting.')
    }
  }
}
```

We can then render our component just like any other Preact component. Notice how we pass the dataStore to our component as a prop:

```javascript
// Pass our dataStore to the component as a dataStore prop:
render(<List dataStore={fruitDataStore}/>, document.body)
```

## Conclusion

Now we have a component whose state is managed by a separate dataStore. We can access this dataStore anywhere to udpate it, causing the component to update. We could create other components that also use this dataStore. In that case a single update of the dataStore would re-render all those components.
