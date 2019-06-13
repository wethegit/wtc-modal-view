# [wtc-modal-view](https://github.com/wethegit/wtc-modal-view#readme) *2.0.0*

> A simple and agnostic modal class.


### src/wtc-modal-view.js


#### instance() 

Holds the one and only Modal instance






##### Returns


- `Void`



#### constructor() 

Creates base dom element.






##### Returns


- `Class`  Modal instance.



#### close() 

Closes modal, removes content and optional class






##### Returns


- `Class`  Modal instance.



#### open(content, optionalClass, focusOnClose) 

Opens modal, add content and optional class




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| content | `string` `DOMNode`  | - String or DOMNode to be added to modal content. | &nbsp; |
| optionalClass | `string`  | - Optional class to be added to modal | &nbsp; |
| focusOnClose | `HTMLElement`  | - Optional element which will receive focus after the modal is closed. Typically, this will be the element which triggered the modal in the first place. | &nbsp; |




##### Returns


- `Class`  Modal instance




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
