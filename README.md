# arp-02
## Compound React Components

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

```
 <Toggle> //Parent component
  //Children components passed in as props
  <ToggleOn>The button is on</ToggleOn>
  <ToggleOff>The button is off</ToggleOff>
  <span>Hello</span>
  <ToggleButton />
</Toggle>
```

The parent component returns cloned children components with the implicit state and methods passed in as `props`.

```
function Toggle(props) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)
  return React.Children.map(props.children, child => { //An array of the child components is returned
    return React.cloneElement(child, {on, toggle}) //Child components are cloned
  })
}
```

It is possible to create an array of allowed child types that will receive the internal props.


```
const allowedTypes = ['ToggleOn', 'ToggleOff', 'ToggleButton']
function Toggle(props) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)
  return React.Children.map(props.children, child => {
    if(allowedTypes.includes(child.type) return React.cloneElement(child, {on, toggle})
    return child
  })
}
```

The user of the compound component does not ever interact with the internal state.
Alternatively, a compound component can allow custom components to be passed in as children and these will receive the implicit state etc. as props.

__Example__

```
const MyCustomComponent = (on, toggle) => on? "I say the button is on" : "I say the button is off"
<Toggle>
  //Children components passed in as props
  <ToggleOn>The button is on</ToggleOn>
  <ToggleOff>The button is off</ToggleOff>
  <ToggleButton />
  <MyCustomComponent />
</Toggle>
``` 

__Important:__ An error will display in the console if there is a child component that cannot accept the props e.g. a DOM component. To mitigate against this the the `React.Children.map()` needs to include an `if` statement.

```
 <Toggle>
  //Children components passed in as props
  <ToggleOn>The button is on</ToggleOn>
  <ToggleOff>The button is off</ToggleOff>
  <span>Hello</span>
  <ToggleButton />
</Toggle>

function Toggle(props) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)
  return React.Children.map(props.children, child => {
    if (typeof child.type === 'string') return child // If `child` is a DOM component then just return the component
    return React.cloneElement(child, {on, toggle})
  })
}
```

Attribution: https://epicreact.dev/modules/advance-react-patterns/ 
