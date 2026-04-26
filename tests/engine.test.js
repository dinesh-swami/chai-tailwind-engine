const assert = require("assert");
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

assert.deepStrictEqual(engine.parseUtility("p-16"), { padding: "16px" });
assert.deepStrictEqual(engine.parseUtility("text-center"), { textAlign: "center" });
assert.deepStrictEqual(engine.parseUtility("bg-red"), { backgroundColor: "#ef4444" });
assert.deepStrictEqual(engine.parseUtility("rounded-xl"), { borderRadius: "20px" });
assert.deepStrictEqual(engine.parseUtility("border-2"), { borderWidth: "2px", borderStyle: "solid" });

const resolved = engine.resolveClassNames("card chai-p-8 chai-bg-blue chai-text-white chai-not-real");
assert.strictEqual(resolved.applied, 3);
assert.deepStrictEqual(resolved.styleMap, {
  padding: "8px",
  "background-color": "#3b82f6",
  color: "#ffffff"
});
assert.deepStrictEqual(resolved.retainedClassNames, ["card", "chai-not-real"]);

assert.deepStrictEqual(engine.parseInlineStyle("padding: 8px; color: #fff"), {
  padding: "8px",
  color: "#fff"
});
assert.strictEqual(
  engine.serializeStyleMap({ padding: "8px", color: "#fff" }),
  "padding: 8px; color: #fff"
);

const first = createMockElement("card chai-p-8 chai-bg-blue chai-text-white");
engine.processElement(first);
assert.strictEqual(first.style.padding, "8px");
assert.strictEqual(first.style.backgroundColor, "#3b82f6");
assert.strictEqual(first.style.color, "#ffffff");
assert.strictEqual(first.className, "card");

const second = createMockElement("chai-p-8 chai-p-16 chai-text-left chai-text-right");
engine.processElement(second);
assert.strictEqual(second.style.padding, "16px");
assert.strictEqual(second.style.textAlign, "right");

const third = createMockElement("chai-not-real chai-bg-green normal");
engine.processElement(third);
assert.strictEqual(third.style.backgroundColor, "#22c55e");
assert.strictEqual(third.className, "normal");

console.log("engine.test.js passed");
