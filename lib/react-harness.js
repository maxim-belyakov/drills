// Shared harness for the React drills. Do not edit.
// Gives you a real DOM (jsdom) and a real React root, so useState, effects and
// events behave exactly as they do in a browser - no mocks, no shortcuts.

require("esbuild-register/dist/node").register({
  extensions: [".jsx"],
  jsx: "automatic",
});

const { JSDOM } = require("jsdom");

const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", {
  pretendToBeVisual: true,
  url: "http://localhost/",
});

const g = globalThis;
g.window = dom.window;
g.document = dom.window.document;
for (const key of ["HTMLElement", "HTMLInputElement", "Event", "MouseEvent", "Node", "getComputedStyle"]) {
  g[key] = dom.window[key];
}
try { Object.defineProperty(g, "navigator", { value: dom.window.navigator, configurable: true }); } catch {}
g.IS_REACT_ACT_ENVIRONMENT = true;

const React = require("react");
const { createRoot } = require("react-dom/client");
const { act } = React;

function render(element) {
  const host = document.getElementById("root");
  const container = document.createElement("div");
  host.innerHTML = "";
  host.appendChild(container);
  let root;
  act(() => {
    root = createRoot(container);
    root.render(element);
  });

  const find = (sel) => {
    const el = container.querySelector(sel);
    if (!el) throw new Error(`nothing matches ${sel}. Current html: ${container.innerHTML}`);
    return el;
  };

  return {
    container,
    text: () => container.textContent,
    html: () => container.innerHTML,
    find,
    all: (sel) => [...container.querySelectorAll(sel)],
    click: (sel) => {
      act(() => { find(sel).dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
    },
    type: (sel, value) => {
      act(() => {
        const el = find(sel);
        const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set;
        setter.call(el, value);
        el.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
      });
    },
    rerender: (el) => { act(() => { root.render(el); }); },
    unmount: () => { act(() => { root.unmount(); }); },
  };
}

module.exports = { React, render, act };
