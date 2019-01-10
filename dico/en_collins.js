// Internaute
module.exports.recursiveMap = function (defin, splitter, defmap) {
    if (defin.indexOf("Traduction anglais") > 0) {
        defin = defin.split(splitter)
            .join("|")
            .split("|");
        defmap[splitter] = defin[1].trim();
        this.recursiveMap(defin[0], "Synonyme", defmap);
    } else if (defin.indexOf("Synonyme") > 0 || defin.indexOf("Synonymes") > 0) {
        defin = defin
            .split("Synonymes :")
            .join("|")
            .split("Synonyme :")
            .join("|")
            .split("|");
        defmap["Synonyme"] = defin[1].trim();
        this.recursiveMap(defin[0], "Exemple :", defmap);
    } else if (defin.indexOf("Exemple :") > 0) {
        defin = defin.split("Exemple :").join("|").split("|");
        defmap["Exemple"] = defin[1].trim();
        this.recursiveMap(defin[0], "NONE", defmap);
    } else {
        defmap["Definition"] = defin.trim();
    }
}



// Get Definition
module.exports.getDefinition = function ($, definitions) {
    
    var definition_map = {};
    // Cob_Adv_Brit
    // Collins_Eng_Dict
    $(".dictionary.Cob_Adv_Brit .dictentry .hom").each(function (i, elem) {
        let defin = [];
        // defin[i] = $(this).children('.gramGrp').text();
        synonymes = [];
        examples = [];

        if ($(this).children('.gramGrp').text().length > 0 && $(this).children('.sense').length > 0) {

            gramgrp = $(this).children('.gramGrp').text();
            definition = $(this).children('.sense').children('.def').text();

            $(this).children('.sense').children('.type-example').each( function(i, elem){
                examples.push($(this).text().trim()); 
            })

            $(this).children('.sense').children('.thes').children('.form').each(function (i, elem) {
                synonymes.push($(this).text().trim());
            })

            

            definitions["Sens"+(i+1)] = {
                'GramGrp': gramgrp,
                'Definition': definition,
                'Examples': examples,
                'Synonymes': synonymes.join(','),
            }
            
        }

        
        // definition_map = { ...definition }
        // $('.translation').children('.lang').text() 
        

        // module.exports.recursiveMap(defin[i], "Traduction anglais", definition_map);

        // definitions = definition;
        // definitions["Sens " + (i + 1)] = {
        //     'Theme': $(this).prev('.inflected_forms').text(),
        //     ...definition_map
        // };

    });

}


// Get Translate 
module.exports.getTranslate = function ($, translate){
    $('.lang').each(function (i, elem) {
        if ($(this).text().trim() == 'French') {
            translate.push($(this).next().text());
        }
    });
}

// Get Synonymes 
module.exports.getSynonymes = function ($, synonymes) {
    $('.dictionary.Cob_Adv_Brit .dictentry .hom').children('.sense').children('.thes').children('.form').each(function (i, elem) {
        synonymes.push($(this).text().trim());
    })
}

// Get Citations 
module.exports.getCitations = function (citations) {
    citations['Citation'] = "There\'s no citation !";
}