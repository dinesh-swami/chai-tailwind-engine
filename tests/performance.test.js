const chaiTailwind = require("../chai.js");

function createMockElement(className) {
  return {
    nodeType: 1,
    className,
    style: {},
    getAttribute(name) {
      return name === "class" ? this.className : "";
    },
    setAttribute(name, value) {
      if (name === "class") {
        this.className = value;
      }
    },
    removeAttribute(name) {
      if (name === "class") {
        this.className = "";
      }
    }
  };
}

const engine = chaiTailwind.createEngine({
  autoInit: false,
  observe: false
});

const items = [];
const start = Date.now();
let index = 0;

for (index = 0; index < 1500; index += 1) {
  items.push(
    createMockElement("chai-p-16 chai-bg-white chai-border chai-rounded-lg chai-text-slate-900 chai-font-bold")
  );
}

for (index = 0; index < items.length; index += 1) {
  engine.processElement(items[index]);
}

const duration = Date.now() - start;
console.log(`performance.test.js processed ${items.length} elements in ${duration}ms`);
