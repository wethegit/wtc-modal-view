# [wtc-modal-view](https://github.com/wethegit/wtc-modal-view#readme) *2.0.0*

> A simple, unopinionated modal class.


### src/wtc-modal-view.js


#### new Modal() 

A Modal class which can display programatically-generated content, or pull in content from an existing DOM node.






##### Returns


- `Void`



#### Modal.constructor([options&#x3D;{}]) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| options&#x3D;{} | `Object`  | - List of options | *Optional* |
| options.closeHtml&#x3D;&#x27;&lt;span&gt;Close&lt;/span&gt;&#x27; | `string`  | - HTML to be inserted inside the close button | *Optional* |
| options.optionalClass | `string`  | - Class to be added to the modal for custom styling | *Optional* |
| options.onOpen | `function`  | - A function to be called when the modal opens | *Optional* |
| options.onClose | `function`  | - A function to be called when the modal closes | *Optional* |




##### Examples

```javascript
const myModal = new Modal();
```


##### Returns


- `Void`



#### Modal.close() 

Closes modal, removes content and optional class,
and shifts user focus back to triggering element, if specified.






##### Returns


- `Void`



#### open(content[, focusOnClose]) 

Opens modal, adds content and optional CSS class




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| content | `string` `HTMLElement`  | - String or DOMNode to be added as the modal content. | &nbsp; |
| focusOnClose | `HTMLElement`  | - Element which will receive focus after the modal is closed. Typically, this will be the element which triggered the modal in the first place. | *Optional* |




##### Examples

```javascript
const myModal = new Modal({ optionalClass: 'test-modal-class' });
const triggerButton = document.querySelector('trigger');
const testContent = '<p>Some sample content!</p>';

triggerButton.addEventListener('click', () => {
  // Passing `this` as the third argument sets our trigger as the focused item once the Modal closes.
  myModal.open(testContent, this);
});
```


##### Returns


- `Void`



#### focusFirstElement() 

Shifts focus to the very beginning of the modal element—just before the close button.






##### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
