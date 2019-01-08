#!/usr/bin/env node

const request = require('request');
const cheerio = require('cheerio');


var program = require('commander');

program
	.version('0.1.0')
	.option('-l, --lang [lang]', 'Choose language [fr,en,fr-en,en-fr]')
	.option('-w, --word [word]', 'Add a word [word]')
  .option('-s, --syn', 'Synonymes')
  .option('-c, --cit', 'Citation')
  .option('-d, --def', 'Definition')
	.parse(process.argv);


if (program.word) {
  console.log('Your word is : ' + program.word);
  word = program.word;
} else {
  console.log('you must input a word --help');
  process.exit();
}


request(
	"https://www.linternaute.fr/dictionnaire/fr/definition/" + word,
  (err, res, body) => {

    //Load HTML body into cheerio
    const $ = cheerio.load(body, { normalizeWhitespace: false });

    var  definition = synonymes =[];
    let sensMap = {};
    let citations = {};

    function recursiveMap(defin, splitter, defmap){
      if (defin.indexOf("Traduction anglais") > 0) {
          defin = defin
            .split(splitter)
            .join("|")
            .split("|");
			  defmap[splitter] = defin[1].trim();
          recursiveMap(defin[0], "Synonyme", defmap);
        } else if (defin.indexOf("Synonyme") > 0 || defin.indexOf("Synonymes") > 0) {
          defin = defin
            .split("Synonymes :")
            .join("|")
            .split("Synonyme :")
            .join("|")
            .split("|");
			  defmap["Synonyme"] = defin[1].trim();
            recursiveMap(defin[0], "Exemple :", defmap);
	  	}else if (defin.indexOf("Exemple :") > 0) {
            defin = defin.split("Exemple :").join("|").split("|");
            defmap["Exemple"] = defin[1].trim();
            recursiveMap(defin[0], "NONE", defmap);
        } else {
			defmap["Definition"] = defin.trim();
        }
    }

    // Get Definitions
    $(".dico_definition .dico_liste li .grid_last").each(function(i, elem) {
          
		  let defMap = {};
      definition[i] = $(this).text();

      recursiveMap(definition[i], "Traduction anglais", defMap);
      
      sensMap["Sens " + (i + 1)] = { 'Theme': $(this).prev('.grid_left').children('.dico_exergue_1').text(), ...defMap };
    
	  });
  
    // Get synonymes
    $(".dico_synonymes .dico_liste li").each(function (i, elem) {
      synonymes[i] = $(this).text().trim();
    });
    
    // Get Citations
    $(".dico_citations .dico_liste li").each(function (i, elem) {
     
      let citMap = {};

      citMap['citation'] = $(this).children().children().first().text().trim(),
      citMap['author'] = $(this).children().children().last().text().trim(),

      citations[i] = { ...citMap }
      
    });


	  sensMap["title_def"] = $('section.dico_main_title span.dico_title_definition').text().trim()
	  
	  
    defaultDef = 'def';
    
    if (program.syn) {
      console.log(synonymes);
      defaultDef = '';
    }
    
    if (program.cit) {
      console.log(citations);
      defaultDef = '';
    }

    if (program.def || defaultDef=='def') {
      console.log(JSON.stringify(sensMap, null, " ").trim());
    }
    
    // console.log(JSON.stringify(sensMap, null, " ").trim());

  }
);