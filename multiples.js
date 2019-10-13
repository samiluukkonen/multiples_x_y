const readline = require("readline");
const fs = require("fs");

const searchMultiples = (n, boundary) => {
  const multiples = [];

  for (let i = 1; i <= boundary; i++) {
    if (i > boundary) {
      break;
    }

    const multiple = i * n;

    if (multiple >= boundary) {
      break;
    }

    multiples.push(multiple);
  }

  return multiples;
};

const calculate = multiplesXY => {
  return multiplesXY.map(multiples => {
    const [x, y, boundary] = multiples;

    const xMultiples = searchMultiples(x, boundary);
    const yMultiples = searchMultiples(y, boundary);

    const foundMultiples = xMultiples
      .concat(yMultiples)
      .filter((element, i, arr) => arr.indexOf(element) === i);
    foundMultiples.sort((a, b) => a - b);

    console.log(`Boundary: ${boundary}`);
    console.log("Found multiples: ", foundMultiples);
    console.log("");

    return { boundary: boundary, multiples: foundMultiples };
  });
};

const readfile = async filename => {
  const readInterface = readline.createInterface({
    input: fs.createReadStream(filename),
    console: false
  });

  const multiplesXY = [];

  for await (const line of readInterface) {
    const split = line.split(" ").map(n => parseInt(n, 10));
    multiplesXY.push(split);
  }

  return multiplesXY;
};

const inputFilename = process.argv[2];
const outputFilename = process.argv[3];

if (inputFilename && outputFilename) {
  readfile(inputFilename).then(response => {
    const results = calculate(response);

    const sortedResults = results
      .sort((a, b) => {
        const aLength = a.multiples.length;
        const bLength = b.multiples.length;

        if (aLength < bLength) {
          return -1;
        }

        if (aLength > bLength) {
          return 1;
        }

        return 0;
      })
      .map(result => `${result.boundary}: ${result.multiples.join(" ")}`);

    console.log("sortedResults", sortedResults);

    fs.writeFile(outputFilename, sortedResults.join("\n"), err => {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    });
  });
} else {
  console.log("Give input and output filenames as arguments");
}
