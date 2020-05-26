# [wtc-modal-view](https://github.com/wethegit/wtc-modal-view#readme) *2.0.1*

> A simple, unopinionated modal class.


### src/wtc-modal-view.js


#### new Modal() 

A Modal class which can display programatically-generated content, or pull in content from an existing DOM node.






##### Examples

```javascript
const myModal = new Modal();
const triggerButton = document.querySelector('trigger');

myModal.optionalClass = "modal--myModal";
myModal.content = '<p>Some sample content!</p>';
myModal.focusOnClose = triggerButton;

triggerButton.addEventListener('click', () => {
  myModal.open();
});
```


##### Returns


- `Void`



#### Modal.close() 

Closes modal, removes content and optional class,
and shifts user focus back to triggering element, if specified.






##### Returns


- `Void`



#### open() 

Opens modal, adds content and optional CSS class






##### Returns


- `Void`



#### focusFirstElement() 

Shifts focus to the first element inside the content






##### Returns


- `Void`



#### focusLastElement() 

Shifts focus to the last element inside the content






##### Returns


- `Void`



#### focusOnClose() 

Gets the element that will be focused when the modal closes






##### Returns


- `HTMLElement`  



#### focusOnClose(element) 

Sets the element that will be focused when the modal closes




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| element | `HTMLElement`  | Must be a focusable element | &nbsp; |




##### Returns


- `Void`



#### onOpen() 

Gets the function that is called when the modal opens






##### Returns


- `Function`  



#### onOpen(callback) 

Sets the function that is called when the modal opens




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| callback | `Function`  |  | &nbsp; |




##### Returns


- `Void`



#### onClose() 

Get the function that is called when the modal closes






##### Returns


- `Function`  



#### onClose(callback) 

Sets the function that is called when the modal closes




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| callback | `Function`  |  | &nbsp; |




##### Returns


- `Void`



#### optionalClass(className) 

Sets an optional class name on the modal for custom styling




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| className | `string`  |  | &nbsp; |




##### Returns


- `Void`



#### optionalClass(optionalClass) 

Gets the optional class name




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| optionalClass | `string`  |  | &nbsp; |




##### Returns


- `Void`



#### closeButtonContent(content) 

Sets the content of the close button, useful for localizing




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| content | `string` `HTMLElement`  |  | &nbsp; |




##### Returns


- `Void`



#### content(content) 

Sets the content of the modal




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| content | `string` `HTMLElement`  |  | &nbsp; |




##### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
