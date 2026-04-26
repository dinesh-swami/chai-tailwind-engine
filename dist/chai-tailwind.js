(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(root);
    return;
  }

  root.ChaiTailwind = factory(root);
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function (root) {
  var VERSION = "1.0.0";
  var DEFAULT_PREFIX = "chai-";
  var DEFAULT_SCALE = [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64];

  var DEFAULT_COLORS = {
    transparent: "transparent",
    white: "#ffffff",
    black: "#111827",
    gray: "#6b7280",
    "gray-100": "#f3f4f6",
    "gray-200": "#e5e7eb",
    "gray-300": "#d1d5db",
    "gray-500": "#6b7280",
    "gray-700": "#374151",
    "gray-900": "#111827",
    slate: "#475569",
    "slate-100": "#f1f5f9",
    "slate-300": "#cbd5e1",
    "slate-500": "#64748b",
    "slate-700": "#334155",
    "slate-900": "#0f172a",
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    amber: "#f59e0b",
    orange: "#f97316",
    cyan: "#06b6d4",
    purple: "#8b5cf6"
  };

  var FONT_SIZES = {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px"
  };

  var FONT_WEIGHTS = {
    thin: "100",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    black: "900"
  };

  var TEXT_ALIGN = {
    left: "left",
    center: "center",
    right: "right",
    justify: "justify"
  };

  var JUSTIFY = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly"
  };

  var ALIGN = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
    baseline: "baseline"
  };

  var RADIUS = {
    none: "0px",
    sm: "4px",
    md: "8px",
    lg: "14px",
    xl: "20px",
    full: "9999px"
  };

  var SHADOWS = {
    sm: "0 6px 18px rgba(15, 23, 42, 0.08)",
    md: "0 14px 34px rgba(15, 23, 42, 0.12)",
    lg: "0 20px 48px rgba(15, 23, 42, 0.18)"
  };

  function cloneObject(value) {
    var next = {};
    var key;

    for (key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        next[key] = value[key];
      }
    }

    return next;
  }

  function mergeConfig(userConfig) {
    var config = userConfig || {};

    return {
      prefix: typeof config.prefix === "string" ? config.prefix : DEFAULT_PREFIX,
      autoInit: config.autoInit !== false,
      observe: config.observe !== false,
      removeClasses: config.removeClasses !== false,
      scale: Array.isArray(config.scale) && config.scale.length ? config.scale.slice() : DEFAULT_SCALE.slice(),
      colors: Object.assign({}, DEFAULT_COLORS, config.colors || {})
    };
  }

  function buildScaleMap(scaleValues) {
    var scaleMap = {};
    var index = 0;

    for (index = 0; index < scaleValues.length; index += 1) {
      scaleMap[String(scaleValues[index])] = String(scaleValues[index]) + "px";
    }

    return scaleMap;
  }

  function isNumberToken(token) {
    return /^-?\d+(\.\d+)?$/.test(token);
  }

  function toLength(token, scaleMap, fallbackKeywords) {
    if (token === "auto") {
      return "auto";
    }

    if (token === "full") {
      return "100%";
    }

    if (token === "screen") {
      return "100vh";
    }

    if (fallbackKeywords && fallbackKeywords[token]) {
      return fallbackKeywords[token];
    }

    if (Object.prototype.hasOwnProperty.call(scaleMap, token)) {
      return scaleMap[token];
    }

    if (isNumberToken(token)) {
      return token + "px";
    }

    return null;
  }

  function toSize(token, scaleMap, dimension) {
    if (token === "full") {
      return "100%";
    }

    if (token === "screen") {
      return dimension === "width" ? "100vw" : "100vh";
    }

    return toLength(token, scaleMap);
  }

  function toColor(token, colors) {
    if (Object.prototype.hasOwnProperty.call(colors, token)) {
      return colors[token];
    }

    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(token) || /^rgb/.test(token) || /^hsl/.test(token)) {
      return token;
    }

    return null;
  }

  function applyBoxSpacing(axis, value) {
    if (axis === "p") {
      return { padding: value };
    }
    if (axis === "pt") {
      return { paddingTop: value };
    }
    if (axis === "pr") {
      return { paddingRight: value };
    }
    if (axis === "pb") {
      return { paddingBottom: value };
    }
    if (axis === "pl") {
      return { paddingLeft: value };
    }
    if (axis === "px") {
      return { paddingLeft: value, paddingRight: value };
    }
    if (axis === "py") {
      return { paddingTop: value, paddingBottom: value };
    }
    if (axis === "m") {
      return { margin: value };
    }
    if (axis === "mt") {
      return { marginTop: value };
    }
    if (axis === "mr") {
      return { marginRight: value };
    }
    if (axis === "mb") {
      return { marginBottom: value };
    }
    if (axis === "ml") {
      return { marginLeft: value };
    }
    if (axis === "mx") {
      return { marginLeft: value, marginRight: value };
    }
    if (axis === "my") {
      return { marginTop: value, marginBottom: value };
    }
    return null;
  }

  function getStaticUtility(token) {
    if (token === "flex") {
      return { display: "flex" };
    }
    if (token === "flex-col") {
      return { display: "flex", flexDirection: "column" };
    }
    if (token === "block") {
      return { display: "block" };
    }
    if (token === "inline-block") {
      return { display: "inline-block" };
    }
    if (token === "inline") {
      return { display: "inline" };
    }
    if (token === "grid") {
      return { display: "grid" };
    }
    if (token === "hidden") {
      return { display: "none" };
    }
    if (token === "border") {
      return { borderWidth: "1px", borderStyle: "solid", borderColor: DEFAULT_COLORS["gray-200"] };
    }
    if (token === "rounded") {
      return { borderRadius: RADIUS.md };
    }
    if (token === "shadow") {
      return { boxShadow: SHADOWS.md };
    }
    return null;
  }

  function parseUtilityToken(token, state) {
    var cached = state.parseCache[token];
    var scaleMap = state.scaleMap;
    var colors = state.config.colors;
    var utility = getStaticUtility(token);
    var parts;
    var prefix;
    var valueToken;
    var value;
    var colorValue;
    var numeric;

    if (cached !== undefined) {
      return cached;
    }

    if (utility) {
      state.parseCache[token] = utility;
      return utility;
    }

    parts = token.split("-");
    prefix = parts[0];
    valueToken = parts.slice(1).join("-");

    if (/^(p|pt|pr|pb|pl|px|py|m|mt|mr|mb|ml|mx|my)$/.test(prefix)) {
      value = toLength(valueToken, scaleMap);
      state.parseCache[token] = value ? applyBoxSpacing(prefix, value) : null;
      return state.parseCache[token];
    }

    if (prefix === "gap") {
      value = toLength(valueToken, scaleMap);
      state.parseCache[token] = value ? { gap: value } : null;
      return state.parseCache[token];
    }

    if (prefix === "bg") {
      colorValue = toColor(valueToken, colors);
      state.parseCache[token] = colorValue ? { backgroundColor: colorValue } : null;
      return state.parseCache[token];
    }

    if (prefix === "text") {
      if (TEXT_ALIGN[valueToken]) {
        state.parseCache[token] = { textAlign: TEXT_ALIGN[valueToken] };
        return state.parseCache[token];
      }

      if (Object.prototype.hasOwnProperty.call(FONT_SIZES, valueToken)) {
        state.parseCache[token] = { fontSize: FONT_SIZES[valueToken] };
        return state.parseCache[token];
      }

      if (isNumberToken(valueToken)) {
        state.parseCache[token] = { fontSize: valueToken + "px" };
        return state.parseCache[token];
      }

      colorValue = toColor(valueToken, colors);
      state.parseCache[token] = colorValue ? { color: colorValue } : null;
      return state.parseCache[token];
    }

    if (prefix === "font") {
      state.parseCache[token] = FONT_WEIGHTS[valueToken] ? { fontWeight: FONT_WEIGHTS[valueToken] } : null;
      return state.parseCache[token];
    }

    if (prefix === "justify") {
      state.parseCache[token] = JUSTIFY[valueToken] ? { justifyContent: JUSTIFY[valueToken] } : null;
      return state.parseCache[token];
    }

    if (prefix === "items") {
      state.parseCache[token] = ALIGN[valueToken] ? { alignItems: ALIGN[valueToken] } : null;
      return state.parseCache[token];
    }

    if (prefix === "border") {
      numeric = toLength(valueToken, scaleMap);
      colorValue = toColor(valueToken, colors);

      if (numeric) {
        state.parseCache[token] = { borderWidth: numeric, borderStyle: "solid" };
        return state.parseCache[token];
      }

      if (colorValue) {
        state.parseCache[token] = { borderColor: colorValue, borderStyle: "solid", borderWidth: "1px" };
        return state.parseCache[token];
      }

      state.parseCache[token] = null;
      return null;
    }

    if (prefix === "rounded") {
      value = RADIUS[valueToken] || toLength(valueToken, scaleMap);
      state.parseCache[token] = value ? { borderRadius: value } : null;
      return state.parseCache[token];
    }

    if (prefix === "shadow") {
      state.parseCache[token] = SHADOWS[valueToken] ? { boxShadow: SHADOWS[valueToken] } : null;
      return state.parseCache[token];
    }

    if (prefix === "w") {
      value = toSize(valueToken, scaleMap, "width");
      state.parseCache[token] = value ? { width: value } : null;
      return state.parseCache[token];
    }

    if (prefix === "h") {
      value = toSize(valueToken, scaleMap, "height");
      state.parseCache[token] = value ? { height: value } : null;
      return state.parseCache[token];
    }

    if (parts[0] === "min" && parts[1] === "h") {
      value = toSize(parts.slice(2).join("-"), scaleMap, "height");
      state.parseCache[token] = value ? { minHeight: value } : null;
      return state.parseCache[token];
    }

    if (parts[0] === "min" && parts[1] === "w") {
      value = toSize(parts.slice(2).join("-"), scaleMap, "width");
      state.parseCache[token] = value ? { minWidth: value } : null;
      return state.parseCache[token];
    }

    if (parts[0] === "max" && parts[1] === "w") {
      value = toSize(parts.slice(2).join("-"), scaleMap, "width");
      state.parseCache[token] = value ? { maxWidth: value } : null;
      return state.parseCache[token];
    }

    if (parts[0] === "grid" && parts[1] === "cols") {
      value = parts[2];
      state.parseCache[token] = isNumberToken(value)
        ? { gridTemplateColumns: "repeat(" + value + ", minmax(0, 1fr))" }
        : null;
      return state.parseCache[token];
    }

    state.parseCache[token] = null;
    return null;
  }

  function applyStyleMap(element, styleMap) {
    var property;

    for (property in styleMap) {
      if (Object.prototype.hasOwnProperty.call(styleMap, property)) {
        element.style[property] = styleMap[property];
      }
    }
  }

  function getClassAttribute(element) {
    if (!element || typeof element.getAttribute !== "function") {
      return "";
    }

    return element.getAttribute("class") || "";
  }

  function splitClassNames(className) {
    return className ? className.trim().split(/\s+/).filter(Boolean) : [];
  }

  function camelToKebabCase(value) {
    return value.replace(/[A-Z]/g, function (match) {
      return "-" + match.toLowerCase();
    });
  }

  function parseInlineStyle(styleValue) {
    var map = {};
    var entries;
    var index;
    var entry;
    var separatorIndex;
    var property;
    var value;

    if (!styleValue) {
      return map;
    }

    entries = styleValue.split(";");
    for (index = 0; index < entries.length; index += 1) {
      entry = entries[index].trim();
      if (!entry) {
        continue;
      }

      separatorIndex = entry.indexOf(":");
      if (separatorIndex === -1) {
        continue;
      }

      property = entry.slice(0, separatorIndex).trim();
      value = entry.slice(separatorIndex + 1).trim();

      if (property && value) {
        map[property] = value;
      }
    }

    return map;
  }

  function serializeStyleMap(styleMap) {
    var cssText = [];
    var property;

    for (property in styleMap) {
      if (Object.prototype.hasOwnProperty.call(styleMap, property) && styleMap[property] !== "") {
        cssText.push(property + ": " + styleMap[property]);
      }
    }

    return cssText.join("; ");
  }

  function hasChaiClass(element, prefix) {
    return getClassAttribute(element).indexOf(prefix) !== -1;
  }

  function setClassAttribute(element, classNames) {
    if (!element || typeof element.setAttribute !== "function") {
      return;
    }

    if (!classNames.length) {
      if (typeof element.removeAttribute === "function") {
        element.removeAttribute("class");
      }
      return;
    }

    element.setAttribute("class", classNames.join(" "));
  }

  function processElement(element, state) {
    var classNames;
    var retained = [];
    var prefix = state.config.prefix;
    var applied = 0;
    var index;
    var className;
    var utility;

    if (!element || element.nodeType !== 1 || !hasChaiClass(element, prefix)) {
      return 0;
    }

    classNames = splitClassNames(getClassAttribute(element));

    for (index = 0; index < classNames.length; index += 1) {
      className = classNames[index];

      if (className.indexOf(prefix) !== 0) {
        retained.push(className);
        continue;
      }

      utility = parseUtilityToken(className.slice(prefix.length), state);

      if (utility) {
        applyStyleMap(element, utility);
        applied += 1;
      }

      if (!state.config.removeClasses) {
        retained.push(className);
      }
    }

    if (state.config.removeClasses) {
      setClassAttribute(element, retained);
    }

    return applied;
  }

  function resolveClassNames(classNameValue, state) {
    var classNames = splitClassNames(classNameValue);
    var retained = [];
    var styleMap = {};
    var prefix = state.config.prefix;
    var index;
    var className;
    var utility;
    var property;
    var applied = 0;

    for (index = 0; index < classNames.length; index += 1) {
      className = classNames[index];

      if (className.indexOf(prefix) !== 0) {
        retained.push(className);
        continue;
      }

      utility = parseUtilityToken(className.slice(prefix.length), state);

      if (!utility) {
        retained.push(className);
        continue;
      }

      for (property in utility) {
        if (Object.prototype.hasOwnProperty.call(utility, property)) {
          styleMap[camelToKebabCase(property)] = utility[property];
        }
      }

      applied += 1;
    }

    return {
      applied: applied,
      retainedClassNames: retained,
      styleMap: styleMap
    };
  }

  function collectTargets(rootNode, state) {
    var targets = [];
    var selector = '[class*="' + state.config.prefix + '"]';
    var nodeList;
    var index;

    if (!rootNode) {
      return targets;
    }

    if (rootNode.nodeType === 1 && hasChaiClass(rootNode, state.config.prefix)) {
      targets.push(rootNode);
    }

    if (typeof rootNode.querySelectorAll !== "function") {
      return targets;
    }

    nodeList = rootNode.querySelectorAll(selector);
    for (index = 0; index < nodeList.length; index += 1) {
      targets.push(nodeList[index]);
    }

    return targets;
  }

  function createEngine(userConfig) {
    var config = mergeConfig(userConfig);
    var state = {
      config: config,
      parseCache: {},
      scaleMap: buildScaleMap(config.scale),
      observer: null,
      initialized: false
    };

    function scan(rootNode) {
      var scope = rootNode || (typeof document !== "undefined" ? document : null);
      var targets = collectTargets(scope, state);
      var applied = 0;
      var index;

      for (index = 0; index < targets.length; index += 1) {
        applied += processElement(targets[index], state);
      }

      return applied;
    }

    function observe() {
      if (typeof MutationObserver === "undefined" || typeof document === "undefined" || !document.body) {
        return null;
      }

      if (state.observer) {
        return state.observer;
      }

      state.observer = new MutationObserver(function (mutations) {
        var mutationIndex;
        var addedIndex;
        var mutation;
        var node;

        for (mutationIndex = 0; mutationIndex < mutations.length; mutationIndex += 1) {
          mutation = mutations[mutationIndex];

          if (mutation.type === "attributes") {
            processElement(mutation.target, state);
          }

          if (mutation.type === "childList") {
            for (addedIndex = 0; addedIndex < mutation.addedNodes.length; addedIndex += 1) {
              node = mutation.addedNodes[addedIndex];
              if (node && node.nodeType === 1) {
                scan(node);
              }
            }
          }
        }
      });

      state.observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"]
      });

      return state.observer;
    }

    function disconnect() {
      if (state.observer) {
        state.observer.disconnect();
        state.observer = null;
      }
    }

    function init(nextConfig) {
      var merged;

      if (nextConfig) {
        merged = mergeConfig(Object.assign({}, config, nextConfig));
        state.config = merged;
        state.scaleMap = buildScaleMap(merged.scale);
      }

      scan(typeof document !== "undefined" ? document : null);

      if (state.config.observe) {
        observe();
      }

      state.initialized = true;
      return api;
    }

    var api = {
      version: VERSION,
      config: cloneObject(config),
      init: init,
      scan: scan,
      observe: observe,
      disconnect: disconnect,
      processElement: function (element) {
        return processElement(element, state);
      },
      resolveClassNames: function (classNameValue) {
        return resolveClassNames(classNameValue, state);
      },
      parseInlineStyle: parseInlineStyle,
      serializeStyleMap: serializeStyleMap,
      parseUtility: function (token) {
        return parseUtilityToken(token, state);
      },
      createEngine: createEngine,
      __internals: {
        defaults: {
          prefix: DEFAULT_PREFIX,
          scale: DEFAULT_SCALE.slice(),
          colors: cloneObject(DEFAULT_COLORS)
        },
        splitClassNames: splitClassNames,
        hasChaiClass: hasChaiClass,
        camelToKebabCase: camelToKebabCase,
        parseInlineStyle: parseInlineStyle,
        serializeStyleMap: serializeStyleMap,
        toLength: toLength,
        toColor: toColor,
        parseUtilityToken: function (token) {
          return parseUtilityToken(token, state);
        }
      }
    };

    return api;
  }

  var engine = createEngine(root && root.ChaiTailwindConfig ? root.ChaiTailwindConfig : {});

  if (typeof document !== "undefined" && engine.config.autoInit !== false) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        engine.init();
      }, { once: true });
    } else {
      engine.init();
    }
  }

  return engine;
});
