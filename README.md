# [wtc-modal-view](https://github.com/wethegit/wtc-modal-view#readme) *2.0.0*

> A simple, unopinionated modal class.


### src/wtc-modal-view.js


#### new Modal() 

A Modal class which can display programatically-generated content, or pull in content from an existing DOM node.






##### Returns


- `Void`



#### Modal.constructor() 

Creates base DOM element.






##### Examples

```javascript
const Modal = new Modal();
```


##### Returns


- `Class`  The Modal instance



#### Modal.close() 

Closes modal, removes content and optional class,
and shifts user focus back to triggering element, if specified.






##### Returns


- `Class`  Modal instance.



#### open(content, optionalClass[, focusOnClose]) 

Opens modal, adds content and optional CSS class




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| content | `string` `HTMLElement`  | - String or DOMNode to be added as the modal content. | &nbsp; |
| optionalClass | `string`  | - Optional CSS class to add to the modal element. | &nbsp; |
| focusOnClose | `HTMLElement`  | - Element which will receive focus after the modal is closed. Typically, this will be the element which triggered the modal in the first place. | *Optional* |




##### Examples

```javascript
const triggerButton = document.querySelector('trigger');
const testContent = '<p>Some sample content!</p>';

triggerButton.addEventListener('click', () => {
  // Passing `this` as the third argument sets our trigger as the focused item once the Modal closes.
  Modal.open(testContent, 'test-modal-class', this);
});
```


##### Returns


- `Class`  Modal instance



#### focusFirstElement() 

Shifts focus to the very beginning of the modal element—just before the close button.






##### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
