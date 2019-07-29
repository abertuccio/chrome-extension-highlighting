const string = 'anthropology 1234; 2345; 5467; microbiology 5492; anthropology MGH MJH';

const arr = string.match(/ ?[a-z]ology /g);

console.log(arr);