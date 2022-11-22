import * as React from 'react'
import {Switch} from '../switch'

function Toggle(props) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)
  return React.Children.map(props.children, child => {
    return React.cloneElement(child, {on, toggle})
  })
}

const ToggleOn = ({on, children}) => {
  return <>{on ? children : null}</>
}

const ToggleOff = ({on, children}) => {
  return <>{!on ? children : null}</>
}

const ToggleButton = ({on, toggle}) => {
  return <Switch on={on} onClick={toggle} />
}

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <ToggleButton />
      </Toggle>
    </div>
  )
}

/*
eslint
  no-unused-vars: "off",
*/

export default App;
