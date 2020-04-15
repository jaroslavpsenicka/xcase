import React from "react";
import { registerAsWebComponent } from "react-webcomponentify";

export const XHypoCreateComponent = props => (
    <div>Hello from React World</div>
);

registerAsWebComponent(XHypoCreateComponent, "xhypo-create");