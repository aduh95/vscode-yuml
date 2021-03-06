const shapes = {
  actor: {
    svgNodes: [
      '<circle cx="0" cy="-20" r="7.5" />',
      '<line x1="0" y1="-12.5" x2="0" y2="5" />',
      '<line x1="-15" y1="-5" x2="15" y2="-5" />',
      '<line x1="0" y1="5" x2="-15" y2="17" />',
      '<line x1="0" y1="5" x2="15" y2="17" />',
    ],
    translateX: 0,
    translateY: 25,
  },
};

const WHITE = "#fff";
const BLACK = "#000";

/**
 * Process embedded shapes {img:shapeName}
 * @param {string} svg The SVG document to parse
 * @param {boolean} isDark Option to get dark or light shapes
 * @returns {string} SVG document embedding shapes
 */
export default function (svg, isDark) {
  const expr = /<text(\s.*)>{img:(.*)}(.*)<\/text>/g;

  return svg.replace(expr, function (match, attributes, shapeName, label) {
    try {
      if (shapeName in shapes) {
        const img = shapes[shapeName];
        const [xAttr, translateX] = /\sx=\"(-?[0-9\.]+)\"/.exec(attributes);
        const [yAttr, translateY] = /\sy=\"(-?[0-9\.]+)\"/.exec(attributes);

        return (
          `<g transform="translate(${translateX},${translateY})" fill="none" stroke="${
            isDark ? WHITE : BLACK
          }" stroke-width="1">${img.svgNodes.join("")}</g><text` +
          attributes
            .replace(xAttr, ` x="${parseFloat(translateX) + img.translateX}"`)
            .replace(yAttr, ` y="${parseFloat(translateY) + img.translateY}"`) +
          `>${label.trim()}</text>`
        );
      } else {
        console.warn(new Error(`Unknown shape '${shapeName}'`));
        return match;
      }
    } catch (e) {
      console.warn(e);
      return match;
    }
  });
}
