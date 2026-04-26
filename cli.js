#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chaiTailwind = require("./chai.js");

const engine = chaiTailwind.createEngine({
  autoInit: false,
  observe: false,
  removeClasses: true
});

const args = process.argv.slice(2);
const targetPath = args[0] ? path.resolve(process.cwd(), args[0]) : process.cwd();

function isHtmlFile(filePath) {
  return /\.(html?)$/i.test(filePath);
}

function shouldSkipDirectory(dirName) {
  return dirName === "node_modules" || dirName === ".git" || dirName === ".next" || dirName === "dist";
}

function collectHtmlFiles(entryPath, bucket) {
  const stats = fs.statSync(entryPath);

  if (stats.isFile()) {
    if (isHtmlFile(entryPath)) {
      bucket.push(entryPath);
    }
    return bucket;
  }

  fs.readdirSync(entryPath, { withFileTypes: true }).forEach((entry) => {
    const nextPath = path.join(entryPath, entry.name);

    if (entry.isDirectory()) {
      if (!shouldSkipDirectory(entry.name)) {
        collectHtmlFiles(nextPath, bucket);
      }
      return;
    }

    if (entry.isFile() && isHtmlFile(nextPath)) {
      bucket.push(nextPath);
    }
  });

  return bucket;
}

function hasChaiScriptTag(markup) {
  return /<script[^>]+src=["'][^"']*chai-tailwind(?:\.min)?\.js["'][^>]*>/i.test(markup);
}

function transformTag(tagMarkup) {
  if (!/\sclass\s*=/.test(tagMarkup)) {
    return { updatedTag: tagMarkup, changed: false, applied: 0 };
  }

  const classMatch = tagMarkup.match(/\sclass\s*=\s*(["'])([\s\S]*?)\1/i);
  if (!classMatch) {
    return { updatedTag: tagMarkup, changed: false, applied: 0 };
  }

  const resolved = engine.resolveClassNames(classMatch[2]);
  if (!resolved.applied) {
    return { updatedTag: tagMarkup, changed: false, applied: 0 };
  }

  const styleMatch = tagMarkup.match(/\sstyle\s*=\s*(["'])([\s\S]*?)\1/i);
  const inlineStyleMap = engine.parseInlineStyle(styleMatch ? styleMatch[2] : "");
  const mergedStyleMap = Object.assign({}, inlineStyleMap, resolved.styleMap);
  const nextStyle = engine.serializeStyleMap(mergedStyleMap);
  let updatedTag = tagMarkup.replace(classMatch[0], resolved.retainedClassNames.length ? ` class="${resolved.retainedClassNames.join(" ")}"` : "");

  if (styleMatch) {
    updatedTag = updatedTag.replace(styleMatch[0], nextStyle ? ` style="${nextStyle}"` : "");
  } else if (nextStyle) {
    updatedTag = updatedTag.replace(/\/?>$/, (ending) => ` style="${nextStyle}"${ending}`);
  }

  return {
    updatedTag,
    changed: updatedTag !== tagMarkup,
    applied: resolved.applied
  };
}

function transformHtml(markup) {
  let changed = false;
  let applied = 0;

  const updatedMarkup = markup.replace(/<([a-zA-Z][^>\s\/]*)([^<>]*)>/g, (fullTag) => {
    if (/^<script\b/i.test(fullTag) || /^<style\b/i.test(fullTag) || /^<link\b/i.test(fullTag) || /^<meta\b/i.test(fullTag)) {
      return fullTag;
    }

    const result = transformTag(fullTag);
    if (result.changed) {
      changed = true;
      applied += result.applied;
      return result.updatedTag;
    }

    return fullTag;
  });

  return { markup: updatedMarkup, changed, applied };
}

function run() {
  const files = collectHtmlFiles(targetPath, []);
  let scannedFiles = 0;
  let changedFiles = 0;
  let totalUtilities = 0;

  files.forEach((filePath) => {
    const source = fs.readFileSync(filePath, "utf8");
    let result;

    if (!hasChaiScriptTag(source)) {
      return;
    }

    scannedFiles += 1;
    result = transformHtml(source);

    if (!result.changed) {
      return;
    }

    fs.writeFileSync(filePath, result.markup, "utf8");
    changedFiles += 1;
    totalUtilities += result.applied;
    console.log(`updated: ${path.relative(process.cwd(), filePath)}`);
  });

  if (!scannedFiles) {
    console.log("No HTML files with a chai-tailwind script tag were found.");
    return;
  }

  console.log(`scanned files: ${scannedFiles}`);
  console.log(`changed files: ${changedFiles}`);
  console.log(`applied utilities: ${totalUtilities}`);
}

run();
