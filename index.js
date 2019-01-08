const request = require('request');
const cheerio = require('cheerio');
var he = require("he"); // he for decoding html entities



let scoreArr = titleArr = [];

request(
  "https://www.linternaute.fr/dictionnaire/fr/definition/test/",
  (err, res, body) => {
    //Load HTML body into cheerio
    const $ = cheerio.load(body, { normalizeWhitespace: false });

    //Scrape karma scores
    //   $(`.dico_liste li`).forEach((el) => {
    //       titleArr.push(el);
    //   });

    //   $(`section`).forEach(el => {
    //     titleArr.push(el.text());
    //   });

    //   console.log(' titleAttr : ', titleArr);
      var  definition = [];

      let sensMap = {};

    function recursiveMap(defin, splitter, defmap){
        if (defin.indexOf("Traduction anglais") > 0) {
          defin = defin
            .split(splitter)
            .join("|")
            .split("|");
          defmap[splitter] = defin[1];
          recursiveMap(defin[0], "Synonyme", defmap);
        } else if (defin.indexOf("Synonyme") > 0 || defin.indexOf("Synonymes") > 0) {
          defin = defin
            .split("Synonymes :")
            .join("|")
            .split("Synonyme :")
            .join("|")
            .split("|");
            defmap["Synonyme"] = defin[1];
            recursiveMap(defin[0], "Exemple :", defmap);
        } else if (defin.indexOf("Exemple :") > 0) {
            defin = defin.split("Exemple :").join("|").split("|");
            defmap["Exemple"] = defin[1];
            recursiveMap(defin, "Exemple :", defmap);
        } else {
          defmap["Definition"] = defin;
        }
    }

      $(".dico_definition .dico_liste li .grid_last").each(function(i, elem) {
          
        let defMap = {};
        // definition[i] = $(this).text().trim();
        /* if there is Synonyme in the text then def[1] Synonyme else if */
          definition[i] = $(this).text();
            // .split("Exemple :").join("EXAMPLE|")
            // .split("Synonymes :").join("SYNONYMES|")
            // .split('Traduction anglais :').join('TRANSLATE|')
            // .split("|");

          recursiveMap(definition[i], "Traduction anglais", defMap);
      
          
          sensMap["Sens "+ (i+1)] = defMap;

          
        });
      console.log('defMapppp :', sensMap);

    //   definition.join(', ');
    //   console.log('fruits',fruits);
    //   console.log('definition : ' + definition[0]);
      

    //   console.log("score : ", $("section.dico_definition .dico_liste").text());
  }
);