# Compound React Components

> The Compound Components Pattern enables you to provide a set of components that implicitly share state for a simple yet powerful declarative API for reusable components.
>
> Compound components are components that work together to form a complete UI. The classic example of this is &lt;select&gt; and &lt;option&gt; in HTML.

~*Kent C Dodds*

__React properties and methods__

- `React.Children.map()`
- `React.cloneElement()`

## The Pattern
Pass in the children components as `props` to the parent component.
e.g.

`App.js`

```
import { ToggleProvider, ToggleOn, ToggleOff, ToggleButton } from "./components/Toggle"

function App() {
  return (
      <ToggleProvider>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <div>Normal HMTL element</div>
        <div>
          <ToggleButton />
        </div>
      </ToggleProvider>
  )
}
  
export default App
```

The user of the compound component does not ever interact with the internal state.

`/context/index.js`

```
const ToggleContext = ()=>{
  const context = React.createContext(false)
  context.displayName = "ToggleContext" //Setting the displayName allows it to be differentially displayed in React DevTools as ToggleContext.Provider and ToggleContext.Provider rather than the generic Context.Provider and Context.Consumer
  return context
}

export { ToggleContext }

```

`/hooks/index.js`

```
import React from "react"
import { ToggleContext } from "./context/"

function useToggle() {
  const context = React.useContext(ToggleContext)
  if (!context) { //Provides the user with a useful error message if they try to use any of the Toggle components outside ofr Toggle.Provider
    throw new Error('useToggle must be utilized with Toggle')
  }
  return context
}

export { useToggle }

```

The parent component returns cloned children components with the implicit state and methods passed in as `props`.

`Toggle.js`

```
import React from "react"
import { ToggleContext } from "./context/"
import { useToggle } from "./hooks/"
import {Switch} from "./components/switch" //Component displaying the switch button

function ToggleProvider(props) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  return (
    <ToggleContext.Provider value={{on, toggle}}>
      {React.Children.map(children, child => {
        return typeof child.type === 'string' //skip html elements
          ? child
          : React.cloneElement(child, {on, toggle})
      })}
    </ToggleContext.Provider>
  )
}

function ToggleOn({children}) {
  const {on} = useToggle()
  return on ? children : null
}

function ToggleOff({children}) {
  const {on} = useToggle()
  return on ? null : children
}

function ToggleButton({...props}) {
  const {on, toggle} = useToggle()
  return <Switch on={on} onClick={toggle} {...props} />
}

export { ToggleProvider, ToggleButton, ToggleOn, ToggleOff }
```

__Important:__ An error will display in the console if there is a child component that cannot accept the props e.g. a DOM component. To mitigate against this the the `React.Children.map()` needs to include an `if` statement.

This allows custom components to be passed in as children and these will receive the implicit state etc. as props.

__Example__

```
const MyCustomComponent = (on, toggle) => on? "I say the button is on" : "I say the button is off"
<Toggle>
  //Children components passed in as props
  <ToggleOn>The button is on</ToggleOn>
  <ToggleOff>The button is off</ToggleOff>
  <ToggleButton />
  <MyCustomComponent /> //This custom component receives the implicit state of the ToggleProvider
</Toggle>
``` 

Alternatively, you can create an array of allowed child types that will receive the internal props.

```
...

function Toggle(props) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)
  const allowedTypes = ['ToggleOn', 'ToggleOff', 'ToggleButton'] //Array of permitted element types
  return  (
    <ToggleContext.Provider value={{on, toggle}}>
      {React.Children.map(props.children, child => {
        if(allowedTypes.includes(child.type.name) return React.cloneElement(child, {on, toggle})
        return child
      })}
    </ToggleContext.Provider>
  )
}

...
```

Attribution: https://epicreact.dev/modules/advance-react-patterns/ 
