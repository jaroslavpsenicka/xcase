# xCase

This is a prototype project for generic case management system. For demo, [click here](https://xcase-test.herokuapp.com).

## What it does

The prototype shows a list of cases of viarious types. The first one (Jan Novak) shows a case of a known type (ihypo type), therefore it includes a complete information, including a collapsible case overview. The case may even be edited, if the business circumstances allows that.

![overview of cases](doc/cases.png)

The second case (Mary Vomaczkowa) represents a case of an unknown type. Therefore it is grayed-out and cannot be previewed and/or edited.

> Don't worry, the missing type will be registred later in the text.

## Case types

Every case has a unique type associated to it and may be seen as a representation of a product. There are certain attributes associated with every type:

- product icon
- a reference (url) to an overview, [webcomponets](http://webcomponents.org)-based component

There will be more to configure, this is just a prototype.

## Registering new type

To register a new product type, navigate to a products section, showing all known case types. To add new type, click the plus sign and choose appropriate case descriptor (json) file. Successfully registered type should look like this:

![overview of cases](doc/products.png)

For the case descriptor file, see [this test file](server/test/product.json).

Once registered, the new case type is applied immediately and the second case gets appropriate icon and overview.

![overview of cases](doc/cases-reg.png)

## Implementation notes

- components are registered by [products context](client/ProductsContext.js) during it's initialization phase (see useEffect -- a new `script` element is created, configured and attached to document body),
- to use the component, a dynamically-named component is constructed and used as overview, see [CaseOverview](client/components/CaseOverview.js) component.

### Rendering 

To implement an component, a [webcomponets.org](http://webcomponents.org) should be used. Here is an example of the [IHYPO case type overview](client/static/ihypo-overview.js). Please note, the component must be registered under appropriate name (`<type-name>-overview`).

```
class IHypoOverview extends HTMLElement {
  connectedCallback () {
    const amount = this.getAttribute('loanamount') || 0;
    const amountFmt = amount < 1000000 ? amount/1000 + 'K' : amount/1000000 + 'M';
    this.innerHTML = `Mortgage, ${amountFmt} CZK, 15 years, 2 applicants`;
  }
}

// register the new custom element
customElements.define('ihypo-overview', IHypoOverview)
```
The 'loanamount' attribute is propagated into the webcomponent from the case data in form of attribute and respective value. Checkout the [CaseOverview](client/components/CaseOverview.js) for details.

> Correct, the overview is not neccesarily accurate for all the cases.

### Eventing

To propagate certain information back into the host application, the web components has to use the CustomEvent mechanism. The host application must expect the event to come, for example, the ihypo-create.js uses the event to propagate the process start event as follows:
```
const submitButton = document.getElementById('submitButton');
  submitButton.onclick = (event) => {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent("submit", { detail: ... }));
  } 
}
```

### Angular

The [xhypo-overview](lib/xhypo-overview) component is implemented using Angular and Angular Elements. No source since this is crazy chatty framework and there are bits and webcomponents-relevant pieces all over the place.

### React

The [xhypo-create](lib/xhypo-create) component is implemented using React and [react-webcomponentify](https://www.npmjs.com/package/react-webcomponentify).
```
import React from "react";
import { registerAsWebComponent } from "react-webcomponentify";

export const XHypoCreateComponent = props => (
    <div>Hello from React World</div>
);

registerAsWebComponent(XHypoCreateComponent, "xhypo-create");
```

### Vue

The [xhypo-detail](lib/xhypo-detail) component is implemented using Vue.
```
<template>
  <div>Welcome from Vue World</div>
</template>

<script>
export default {
  name: "xhypo-detail",
  components: {},
  data() {},
  methods: {}
};
</script>

<style lang="scss">
</style>
```

### Furure framework

Use your future fancy framework as long as it supports the webcomponents standard. 
Use webcomponents, stop the framework wars, do something meaningful.

## Summary and next steps

The existing code shows implementation of webcomponents-based case list using React/Node. This is very basic implementation, may be extended heavily

- [x] [implement proper overview, showing real data](https://github.com/jaroslavpsenicka/xcase/issues/1)
- [x] [implement proper case-type/product detail page showing details of registered JSON](https://github.com/jaroslavpsenicka/xcase/issues/2)
- [x] [implement a case editor web component](https://github.com/jaroslavpsenicka/xcase/issues/3) 
- [x] [implement some form of a new case button and use a web component to create case](https://github.com/jaroslavpsenicka/xcase/issues/4) 
- [x] [implement better validations during JSON upload](https://github.com/jaroslavpsenicka/xcase/issues/5)
- [x] [implement some components](https://github.com/jaroslavpsenicka/xcase/issues/6) using [Angular](https://medium.com/@IMM9O/web-components-with-angular-d0205c9db08f)/[React](https://dev.to/frustigor/the-fastest-way-to-create-web-components-with-react-403)/[Vue](https://dev.to/aumayeung/create-web-components-with-vue-js-2bb0)
- [x] [allow registering custom case actions](https://github.com/jaroslavpsenicka/xcase/issues/7)

lower priority tasks:

- [ ] allow registering case-type/product-specific settings component
- [ ] allow processing REST or Kafka-based events, for example case creation notification
- [ ] consider versioning and rollbacks of misbehaving JSONs
- [ ] consider receiving and displaying notifiations
