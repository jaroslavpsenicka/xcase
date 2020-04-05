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

To implement an overview, a [webcomponets.org](http://webcomponents.org) should be used. Here is an example of the [IHYPO case type overview](client/static/ihypo-overview.js). Please note, the component must be registered under appropriate name (`<type-name>-overview`).

```
class IHypoOverview extends HTMLElement {
  connectedCallback () {
    this.innerHTML = 'Mortgage, 2.1M CZK, 15 years, 2 applicants'
  }
}

// register the new custom element
customElements.define('ihypo-overview', IHypoOverview)
```

> Correct, the overview is not neccesarily accurate for all the cases.

## Summary and next steps

The existing code shows implementation of webcomponents-based case list using React/Node. This is very basic implementation, may be extended heavily

- implement proper overview, showing real data (propagated from case via props)
- implement proper case-type/product detail page showing details of registered JSON,
- implement a case editor web component
- implement some form of a new case button and use appropriate web component to create case
- allow registering custom case actions, including the show-webcomponent-in-a-dialog feature
- allow registering case-type/product-specific settings component 
- allow processing REST or Kafka-based events, for example case creation notification
- implement better validations during JSON upload, incl. webcomponent checks,
- think about versioning and rollbacks of misbehaving JSONs
- think about receiving and displaying notifiations
