var fs = require('fs');
var path = require('path');

var sourceDir = 'src/';
var list = [];

function recursive_ls(path, list){
  var ls = fs.readdirSync(path);
  for (var i = 0; i < ls.length; i++) {
    var filename = path + ls[i];
    var stat = fs.statSync(filename);
    if (stat.isDirectory()) {
      filename+='/';
      list = recursive_ls(filename, list);
    } else {
      list.push(filename);
    }
  }
  return list;
}

var files = recursive_ls(sourceDir, list);

// console.log(files);


for (var i = 0; i < files.length; i++) {
  var contents = fs.readFileSync(files[i]);
  var jsonContent = JSON.parse(contents);
  var jsonString = JSON.stringify(jsonContent);
  jsonString = jsonString.replace(/\\/g, '\\\\')
  var outfilename = path.basename(files[i], '.json');
  outfilename = 'lib/' + outfilename + '.js';
  var outfile = fs.openSync(outfilename, 'w');
  var outstring = `export let map=JSON.parse('${jsonString}')`;
  fs.writeSync(outfile, outstring);
}
