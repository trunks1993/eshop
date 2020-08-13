/*
 * @Date: 2020-08-12 10:34:07
 * @LastEditTime: 2020-08-12 15:46:26
 */
const loaderUtils = require("loader-utils");

// 默认参数
const defaultopts = {
  unitToConvert: "px",
  viewportWidth: 750,
  unitPrecision: 4,
  viewportUnit: "vw",
  fontViewportUnit: "vw",
  minPixelValue: 1,
};

module.exports = function (source) {
  const opts = loaderUtils.getOptions(this);
  const config = Object.assign({}, defaultopts, opts);

  const ZPXRegExp = /\b(\d+(\.\d+)?)SUPX\b/;
  let pxGlobalRegExp = new RegExp(ZPXRegExp.source, "g");
  if (this.cacheable) {
    this.cacheable();
  }
  if (pxGlobalRegExp.test(source)) {
    return source.replace(
      pxGlobalRegExp,
      createPxReplace(
        config.viewportWidth,
        config.minPixelValue,
        config.unitPrecision,
        config.viewportUnit
      )
    );
  } else {
    return source;
  }
};

function createPxReplace(
  viewportSize,
  minPixelValue,
  unitPrecision,
  viewportUnit
) {
  return function ($0, $1) {
    if (!$1) return;
    var pixels = parseFloat($1);
    if (pixels <= minPixelValue) return;
    return toFixed((pixels / viewportSize) * 100, unitPrecision) + viewportUnit;
  };
}

function toFixed(number, precision) {
  var multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
}
