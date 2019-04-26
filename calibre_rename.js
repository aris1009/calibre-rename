const {
  execSync
} = require('child_process');
const conf = require('./config.json');
const fs = require('fs');

const calibre = (stream = false) => {
  let query = `calibredb list -s ${conf.query}:"${conf.query_term}" -f title`;

  const changesToApply = {};
  let output = execSync(query).toString();
  if (!output) console.log('Query returned no results!');
  output = output.slice(output.indexOf(conf.split_str) + conf.split_str.length);
  output.split(new RegExp(conf.split_str, 'g') || []).map(book => {
    let id = book.slice(0, book.indexOf(' '));
    if (id) {
      let name = book.slice(book.indexOf(' ')).trim()
      let newName = name.replace(new RegExp(conf.reg_replace, "gi"), ' ').replace(/ +/g, ' ').trim();
      newName = wordCapitalizer(newName);
      let issueNumber = newName.match(/\d+/g) || [];
      if (conf.padded_numbers_up_to_thousand && issueNumber[0] && issueNumber[0] < 100 && issueNumber[0] > 9) {
        let padded = issueNumber[0].padStart(3, '0');
        newName = newName.replace(/\d+/g, padded);
      }
      changesToApply[id] = {};
      changesToApply[id].currentName = name;
      changesToApply[id].newName = newName;
    }
  });

  let total_books_renamed = 0;
  Object.keys(changesToApply).map((id, index, iteratedArray) => {
    let titleSet = `calibredb set_metadata -f title:"${changesToApply[id].newName}" -f sort:"${changesToApply[id].newName}" ${id}`
    let renamed = `${id}: ${changesToApply[id].currentName} -> ${changesToApply[id].newName}`
    if (changesToApply[id].newName == changesToApply[id].currentName) {
      let log = `${id}: ${changesToApply[id].currentName}. No need to rename!\n`;
      if (stream) stream.write(log)
      if (conf.debug) console.log(log);
    } else if (conf.enable_title_set) {
      let result = execSync(titleSet).toString();
      total_books_renamed++;
      if (stream) stream.write(renamed);
      console.log(renamed);
    } else {
      if (stream) {
        stream.write(`${renamed}\n`)
        if (conf.write_to_log_commands) stream.write(`      ${titleSet}\n\n`);
      }
    }
    if (conf.debug) console.log(titleSet);
    if ((index + 1) == iteratedArray.length) {
      let report = `Finished operation:\n  Total:    ${index+1}\n  Renamed:  ${total_books_renamed}`
      if (stream) stream.write(report)
      console.log(report);
    }
  })
}

function wordCapitalizer(string) {
  let array = string.split(' ');
  for (let [index, word] of array.entries()) {
    if (isNaN(word) && word.length > 3) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
      array[index] = word
    }
  }
  return array.join(' ');
}

const createLogFileName = function(time) {
  let d = new Date(time);
  let offset = (new Date().getTimezoneOffset() / 60) * -1;
  let n = new Date(d.getTime() + offset);
  let logPath = `${n.getDate().toString().padStart(2, '0')}${n.getMonth().toString().padStart(2, '0')}${n.getFullYear().toString().padStart(2, '0')}-${n.getHours().toString().padStart(2, '0')}${n.getMinutes().toString().padStart(2, '0')}${n.getSeconds().toString().padStart(2, '0')}+${n.getMilliseconds()}.log`;
  return logPath;
};

if (conf.write_to_log) {
  const logPath = `${__dirname}/logs/${createLogFileName(new Date())}`
  const stream = fs.createWriteStream(logPath, {
    'flags': 'a'
  });
  calibre(stream);
} else {
  calibre();
}
